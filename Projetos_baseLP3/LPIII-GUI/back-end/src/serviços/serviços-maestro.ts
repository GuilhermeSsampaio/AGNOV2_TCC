import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import ServiçosUsuário from "./serviços-usuário";
import Maestro from "../entidades/maestro";
import PeçaMusical from "../entidades/peça-musical";
import Patrocínio from "src/entidades/patrocínio";

export default class ServiçosMaestro {
  constructor() {}
  static async cadastrarMaestro(request, response) {
    try {
      const { usuário_info, estilo, anos_experiência, nacionalidade } =
        request.body;
      const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(
        usuário_info
      );
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);
        const maestro = Maestro.create({
          usuário,
          estilo,
          anos_experiência,
          nacionalidade,
        });
        await transactionManager.save(maestro);
        await transactionManager.update(Usuário, usuário.cpf, {
          status: Status.ATIVO,
        });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) {
      return response.status(500).json({ erro: error });
    }
  }
  static async atualizarMaestro(request, response) {
    try {
      const { cpf, estilo, anos_experiência, nacionalidade } = request.body;
      const cpf_encriptado = md5(cpf);
      await Maestro.update(
        { usuário: { cpf: cpf_encriptado } },
        { estilo, anos_experiência, nacionalidade }
      );
      return response.json();
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : atualizarMaestro" });
    }
  }

  static async buscarMaestro(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const maestro = await Maestro.findOne({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"],
      });
      if (!maestro)
        return response.status(404).json({ erro: "Maestro não encontrado." });
      return response.json({
        nome: maestro.usuário.nome,
        email: maestro.usuário.email,
        estilo: maestro.estilo,
        anos_experiência: maestro.anos_experiência,
        nacionalidade: maestro.nacionalidade,
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : buscarMaestro" });
    }
  }

  static async cadastrarPeçaMusical(request, response) {
    try {
      const { título, duração, tom, gênero, cpf, internacional } = request.body;
      const cpf_encriptado = md5(cpf);
      const maestro = await Maestro.findOne({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"],
      });
      await PeçaMusical.create({
        título,
        duração,
        tom,
        gênero,
        maestro,
        internacional,
      }).save();
      return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : cadastrarPeçaMusical" });
    }
  }

  static async alterarPeçaMusical(request, response) {
    try {
      const { id, título, duração, tom, gênero, internacional } = request.body;
      await PeçaMusical.update(id, {
        título,
        duração,
        tom,
        gênero,
        internacional,
      });
      return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : alterarPeçaMusical", error });
    }
  }

  static async removerPeçaMusical(request, response) {
    try {
      const id_peça = request.params.id;
      const peçaMusical = await PeçaMusical.findOne(id_peça);
      await PeçaMusical.remove(peçaMusical);
      return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : removerPeçaMusical" });
    }
  }

  static async buscarPeçasMusicaisMaestro(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const peçasMusicais = await PeçaMusical.find({
        where: { maestro: { usuário: cpf_encriptado } },
        relations: ["maestro", "maestro.usuário"],
      });
      return response.json(peçasMusicais);
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarPeçasMusicaisMaestro" });
    }
  }

  static filtrarEstilosEliminandoRepetição(peçasMusicais: PeçaMusical[]) {
    let estilos: { label: string; value: string }[];
    estilos = peçasMusicais
      .filter(
        (peçaMusical, índice, peças_antes_filtrar) =>
          peças_antes_filtrar.findIndex(
            (peça_anterior) => peça_anterior.gênero === peçaMusical.gênero
          ) === índice
      )
      .map((peçaMusical) => ({
        label: peçaMusical.gênero,
        value: peçaMusical.gênero,
      }));
    return estilos;
  }

  static async buscarPatrocíniosPeçasMusicais(request, response) {
    try {
      const peçasMusicais = await PeçaMusical.find();
      const estilos =
        ServiçosMaestro.filtrarEstilosEliminandoRepetição(peçasMusicais);
      return response.json(estilos.sort());
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarPatrocíniosPeçasMusicais" });
    }
  }

  static async buscarPatrocíniosPeçaMusical(request, response) {
    try {
      const id_peça_musical = request.params.id;
      const patrocínios = await Patrocínio.find({
        where: { peça_musical: { id: id_peça_musical } },
        relations: ["patrocinador", "patrocinador.usuário", "peça_musical"],
      });
      return response.json(patrocínios);
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarPatrocíniosPeçaMusical" });
    }
  }
}
