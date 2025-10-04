import bcrypt from "bcrypt";
import dotenv from "dotenv";
import md5 from "md5";
import { sign } from "jsonwebtoken";
import Usuario, { Cores, Perfil, Status } from "../entidades/usuario";

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
        return response.status(400).json({ erro: "CPF ja cadastrado." });
      else return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD: verificarCpfCadastrado" });
    }
  }

  // ... codigo existente ...

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
      const usuario = await Usuario.findOne(cpf_encriptado);
      if (!usuario)
        return response
          .status(404)
          .json({ erro: "Nome de usuario nao cadastrado." });
      const cadastro_completo = await ServicosUsuario.verificarCadastroCompleto(
        usuario
      );
      if (!cadastro_completo) {
        await Usuario.remove(usuario);
        return response.status(400).json({
          erro: "Cadastro incompleto. Por favor, realize o cadastro novamente.",
        });
      }

      const senha_correta = await bcrypt.compare(senha, usuario.senha);
      if (!senha_correta)
        return response.status(401).json({ erro: "Senha incorreta." });
      if (usuario.status === Status.PENDENTE) {
        usuario.status = Status.ATIVO;
        await Usuario.save(usuario);
      }
      const token = sign(
        { perfil: usuario.perfil, email: usuario.email },
        SENHA_JWT,
        { subject: usuario.nome, expiresIn: "1d" }
      );
      return response.json({
        usuarioLogado: {
          nome: usuario.nome,
          perfil: usuario.perfil,
          email: usuario.email,
          questao: usuario.questao,
          status: usuario.status,
          cor_tema: usuario.cor_tema,
          token,
        },
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD: logarUsuario" });
    }
  }

  static async cadastrarUsuario(request, response) {
    try {
      const usuario_informado = request.body;
      const {
        cpf,
        nome,
        perfil: perfilInformado,
        email,
        senha,
        questao,
        resposta,
        cor_tema: corTemaInformado,
      } = usuario_informado;
      const perfil = perfilInformado ?? Perfil.USUARIO;
      const cor_tema = corTemaInformado ?? Cores.CINZA_ESCURO;
      if (!cpf || !nome || !email || !senha || !questao || !resposta) {
        return response.status(400).json({
          erro: "Campos obrigatorios faltando no cadastro do usuario.",
        });
      }
      console.log("ServicosUsuario.cadastrarUsuario:nome -- " + nome);
      const cpf_encriptado = md5(cpf);
      const senha_encriptada = await bcrypt.hash(senha, SALT);
      const resposta_encriptada = await bcrypt.hash(resposta, SALT);
      const usuario = Usuario.create({
        cpf: cpf_encriptado,
        nome,
        perfil,
        email,
        senha: senha_encriptada,
        questao,
        resposta: resposta_encriptada,
        cor_tema,
        status: Status.ATIVO,
      });
      const usuarioSalvo = await Usuario.save(usuario);
      const token = sign(
        { perfil: usuario.perfil, email: usuario.email },
        SENHA_JWT,
        { subject: usuario.nome, expiresIn: "1d" }
      );
      const usuarioResposta = {
        cpf,
        nome: usuarioSalvo.nome,
        perfil: usuarioSalvo.perfil,
        email: usuarioSalvo.email,
        questao: usuarioSalvo.questao,
        status: usuarioSalvo.status,
        cor_tema: usuarioSalvo.cor_tema,
      };
      return response.json({ usuario: usuarioResposta, token });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD: cadastrarUsuario: " + error.message });
    }
  }
  static async alterarUsuario(request, response) {
    try {
      const { cpf, senha, questao, resposta, cor_tema, email } = request.body;
      const cpf_encriptado = md5(cpf);
      let senha_encriptada: string, resposta_encriptada: string;
      let token: string;
      const usuario = await Usuario.findOne(cpf_encriptado);
      if (email) {
        usuario.email = email;
        token = sign({ perfil: usuario.perfil, email }, SENHA_JWT, {
          subject: usuario.nome,
          expiresIn: "1d",
        });
      }
      if (cor_tema) usuario.cor_tema = cor_tema;
      if (senha) {
        senha_encriptada = await bcrypt.hash(senha, SALT);
        usuario.senha = senha_encriptada;
      }
      if (resposta) {
        resposta_encriptada = await bcrypt.hash(resposta, SALT);
        usuario.questao = questao;
        usuario.resposta = resposta_encriptada;
      }
      await Usuario.save(usuario);
      const usuario_info = {
        nome: usuario.nome,
        perfil: usuario.perfil,
        email: usuario.email,
        questao: usuario.questao,
        status: usuario.status,
        cor_tema: usuario.cor_tema,
        token: null,
      };
      if (token) usuario_info.token = token;
      return response.json(usuario_info);
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD: alterarUsuario" });
    }
  }

  static async removerUsuario(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        const usuario = await transactionManager.findOne(
          Usuario,
          cpf_encriptado
        );
        await transactionManager.remove(usuario);
        return response.json();
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD: removerUsuario" });
    }
  }
  static async buscarQuestaoSeguranca(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const usuario = await Usuario.findOne(cpf_encriptado);
      if (usuario) return response.json({ questao: usuario.questao });
      else return response.status(404).json({ mensagem: "CPF nao cadastrado" });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarquestaoSeguranca" });
    }
  }
  static async verificarRespostaCorreta(request, response) {
    try {
      const { cpf, resposta } = request.body;
      const cpf_encriptado = md5(cpf);
      const usuario = await Usuario.findOne(cpf_encriptado);
      const resposta_correta = await bcrypt.compare(resposta, usuario.resposta);
      if (!resposta_correta)
        return response.status(401).json({ mensagem: "Resposta incorreta." });
      const token = sign(
        { perfil: usuario.perfil, email: usuario.email },
        process.env.SENHA_JWT,
        { subject: usuario.nome, expiresIn: "1h" }
      );
      return response.json({ token });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD: verificarRespostaCorreta" });
    }
  }
}
