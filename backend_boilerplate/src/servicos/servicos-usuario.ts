import bcrypt from "bcrypt";
import dotenv from "dotenv";
import md5 from "md5";
import { sign } from "jsonwebtoken";
import Usuario, { Perfil } from "../entidades/usuario";

import { getManager } from "typeorm";

dotenv.config();

const SALT = 10;
const SENHA_JWT = process.env.SENHA_JWT;

export default class ServicosUsuario {
  constructor() {}
  static async verificarCpfExistente(request, response) {
    await ServicosUsuario.listarTodosUsuarios();
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const usuario = await Usuario.findOne(cpf_encriptado);
      console.log("cpf", cpf_encriptado);
      if (usuario)
        return response.status(400).json({ erro: "CPF já cadastrado." });
      else return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD: verificarCpfCadastrado" });
    }
  }

  // ... código existente ...

  static async listarTodosUsuarios() {
    try {
      const usuarios = await Usuario.find();
      console.log("users:", usuarios);
      console.log("=== Lista de Todos os Usuarios ===");
      // usuarios.forEach((usuario, index) => {
      //   console.log(`\nUsuario ${index + 1}:`);
      //   console.log(`Nome: ${usuario.nome}`);
      //   console.log(`CPF: ${usuario.cpf}`);
      //   console.log(`Perfil: ${usuario.perfil}`);
      //   console.log(`Email: ${usuario.email}`);
      //   console.log(`Status: ${usuario.status}`);
      //   console.log("------------------------");
      // });
      // console.log(`Total de usuarios: ${usuarios.length}`);
      return usuarios;
    } catch (error) {
      console.error("Erro ao listar usuarios:", error);
      throw new Error("Erro ao buscar usuarios no banco de dados");
    }
  }

  static async verificarCadastroCompleto(usuario: Usuario) {
    return true;
  }

  static async logarUsuario(request, response) {
    try {
      const { nome_login, senha } = request.body;
      const cpf_encriptado = md5(nome_login);
      const usuário = await Usuario.findOne(cpf_encriptado);
      if (!usuário)
        return response
          .status(404)
          .json({ erro: "Nome de usuário não cadastrado." });
      const cadastro_completo = await ServicosUsuario.verificarCadastroCompleto(
        usuário
      );
      if (!cadastro_completo) {
        await Usuario.remove(usuário);
        return response.status(400).json({
          erro: "Cadastro incompleto. Por favor, realize o cadastro novamente.",
        });
      }

      const senha_correta = await bcrypt.compare(senha, usuário.senha);
      if (!senha_correta)
        return response.status(401).json({ erro: "Senha incorreta." });
      const token = sign(
        { perfil: usuário.perfil, email: usuário.email },
        SENHA_JWT,
        { subject: usuário.nome, expiresIn: "1d" }
      );
      return response.json({
        usuárioLogado: {
          nome: usuário.nome,
          perfil: usuário.perfil,
          email: usuário.email,
          questao: usuário.questao,
          status: usuário.status,
          cor_tema: usuário.cor_tema,
          token,
        },
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD: logarUsuário" });
    }
  }

  static async cadastrarUsuario(request, response) {
    try {
      const usuário_informado = request.body;
      const { cpf, nome, perfil, email, senha, questao, resposta, cor_tema } =
        usuário_informado;
      if (
        !cpf ||
        !nome ||
        !perfil ||
        !email ||
        !senha ||
        !questao ||
        !resposta
      ) {
        return response.status(400).json({
          erro: "Campos obrigatórios faltando no cadastro do usuário.",
        });
      }
      console.log("ServiçosUsuário.cadastrarUsuário:nome -- " + nome);
      const cpf_encriptado = md5(cpf);
      const senha_encriptada = await bcrypt.hash(senha, SALT);
      const resposta_encriptada = await bcrypt.hash(resposta, SALT);
      const usuário = Usuario.create({
        cpf: cpf_encriptado,
        nome,
        perfil,
        email,
        senha: senha_encriptada,
        questao,
        resposta: resposta_encriptada,
        cor_tema,
      });
      await Usuario.save(usuário);
      const token = sign(
        { perfil: usuário.perfil, email: usuário.email },
        SENHA_JWT,
        { subject: usuário.nome, expiresIn: "1d" }
      );
      return response.json({ usuário, token });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD: cadastrarUsuário: " + error.message });
    }
  }
  static async alterarUsuario(request, response) {
    try {
      const { cpf, senha, questao, resposta, cor_tema, email } = request.body;
      const cpf_encriptado = md5(cpf);
      let senha_encriptada: string, resposta_encriptada: string;
      let token: string;
      const usuário = await Usuario.findOne(cpf_encriptado);
      if (email) {
        usuário.email = email;
        token = sign({ perfil: usuário.perfil, email }, SENHA_JWT, {
          subject: usuário.nome,
          expiresIn: "1d",
        });
      }
      if (cor_tema) usuário.cor_tema = cor_tema;
      if (senha) {
        senha_encriptada = await bcrypt.hash(senha, SALT);
        usuário.senha = senha_encriptada;
      }
      if (resposta) {
        resposta_encriptada = await bcrypt.hash(resposta, SALT);
        usuário.questao = questao;
        usuário.resposta = resposta_encriptada;
      }
      await Usuario.save(usuário);
      const usuário_info = {
        nome: usuário.nome,
        perfil: usuário.perfil,
        email: usuário.email,
        questao: usuário.questao,
        status: usuário.status,
        cor_tema: usuário.cor_tema,
        token: null,
      };
      if (token) usuário_info.token = token;
      return response.json(usuário_info);
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD: alterarUsuário" });
    }
  }

  static async removerUsuario(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        const usuário = await transactionManager.findOne(
          Usuario,
          cpf_encriptado
        );
        await transactionManager.remove(usuário);
        return response.json();
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD: removerUsuário" });
    }
  }
  static async buscarQuestaoSeguranca(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const usuário = await Usuario.findOne(cpf_encriptado);
      if (usuário) return response.json({ questao: usuário.questao });
      else return response.status(404).json({ mensagem: "CPF não cadastrado" });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarquestaoSegurança" });
    }
  }
  static async verificarRespostaCorreta(request, response) {
    try {
      const { cpf, resposta } = request.body;
      const cpf_encriptado = md5(cpf);
      const usuário = await Usuario.findOne(cpf_encriptado);
      const resposta_correta = await bcrypt.compare(resposta, usuário.resposta);
      if (!resposta_correta)
        return response.status(401).json({ mensagem: "Resposta incorreta." });
      const token = sign(
        { perfil: usuário.perfil, email: usuário.email },
        process.env.SENHA_JWT,
        { subject: usuário.nome, expiresIn: "1h" }
      );
      return response.json({ token });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD: verificarRespostaCorreta" });
    }
  }
}
