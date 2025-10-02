import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Patrocinador from "../entidades/patrocinador";
import ServiçosUsuário from "./serviços-usuário";
import PeçaMusical from "../entidades/peça-musical";
import Patrocínio from "../entidades/patrocínio";
export default class ServiçosPatrocinador {
  constructor() {}
  static async cadastrarPatrocínio(request, response) {
    try {
      const { id_peça, orçamento_disponível, cpf, show_exposicao } =
        request.body;
      const cpf_encriptado = md5(cpf);
      const patrocinador = await Patrocinador.findOne({
        where: { usuário: cpf_encriptado },
      });
      const peça_musical = await PeçaMusical.findOne(id_peça);
      const patrocínios = await Patrocínio.find({
        where: { patrocinador, peça_musical },
      });
      if (patrocínios.length > 0)
        return response.status(404).json({
          erro: "O patrocinador já cadastrou patrocínio para a peça.",
        });
      await Patrocínio.create({
        orçamento_disponível,
        patrocinador,
        peça_musical,
        show_exposicao,
      }).save();
      return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : cadastrarPatrocínio" });
    }
  }

  static async removerPatrocínio(request, response) {
    try {
      const id = request.params.id;
      await Patrocínio.delete(id);
      return response.json();
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : removerPatrocínio" });
    }
  }

  static async buscarPatrocíniosPatrocinador(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const patrocínios = await Patrocínio.find({
        where: { patrocinador: { usuário: cpf_encriptado } },
        relations: [
          "patrocinador",
          "patrocinador.usuário",
          "peça_musical",
          "peça_musical.maestro",
          "peça_musical.maestro.usuário",
        ],
      });
      return response.json(patrocínios);
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarPatrocíniosPatrocinador" });
    }
  }

  static async buscarPeçasMusicais(request, response) {
    try {
      const peças = await PeçaMusical.find({
        relations: ["maestro", "maestro.usuário"],
      });
      return response.json(peças);
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : buscarPeças" });
    }
  }

  static async cadastrarPatrocinador(request, response) {
    try {
      const { usuário_info, empresa, telefone } = request.body;
      const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(
        usuário_info
      );
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);
        const patrocinador = Patrocinador.create({
          usuário,
          empresa: empresa,
          telefone,
        });
        await transactionManager.save(patrocinador);
        await transactionManager.update(Usuário, usuário.cpf, {
          status: Status.ATIVO,
        });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) {
      return response.status(500).json({ erro: error });
    }
  }
  static async atualizarPatrocinador(request, response) {
    try {
      const { cpf, empresa, telefone } = request.body;
      const cpf_encriptado = md5(cpf);
      await Patrocinador.update(
        { usuário: { cpf: cpf_encriptado } },
        { empresa: empresa, telefone }
      );
      return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : atualizarPatrocinador" });
    }
  }
  static async buscarPatrocinador(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const patrocinador = await Patrocinador.findOne({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"],
      });
      if (!patrocinador)
        return response
          .status(404)
          .json({ erro: "Patrocinador não encontrado." });
      return response.json({
        nome: patrocinador.usuário.nome,
        empresa: patrocinador.empresa,
        telefone: patrocinador.telefone,
      });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarPatrocinador" });
    }
  }
}
