import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
} from "typeorm";

import Maestro from "./maestro";
import Patrocinador from "./patrocinador";

export enum Perfil {
  PATROCINADOR = "patrocinador",
  MAESTRO = "maestro",
}

export enum Status {
  PENDENTE = "pendente",
  ATIVO = "ativo",
  INATIVO = "inativo",
}

export enum Cores {
  AMARELO = "yellow",
  ANIL = "indigo",
  AZUL = "blue",
  AZUL_PISCINA = "cyan",
  CINZA_ESCURO = "bluegray",
  LARANJA = "orange",
  ROSA = "pink",
  ROXO = "purple",
  VERDE = "green",
  VERDE_AZULADO = "teal",
}
// falta ver se os atributos estão certros

@Entity()
export default class Usuário extends BaseEntity {
  @PrimaryColumn()
  cpf: string;

  @Column({ type: "enum", enum: Perfil })
  perfil: Perfil;

  @Column({ type: "enum", enum: Status, default: Status.PENDENTE })
  status: Status;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  questão: string;

  @Column()
  resposta: string;

  @Column({ type: "enum", enum: Cores })
  cor_tema: string;

  @OneToOne(() => Maestro, (maestro) => maestro.usuário, {
    onDelete: "CASCADE",
  })
  maestro: Maestro;

  @OneToOne(() => Patrocinador, (patrocinador) => patrocinador.usuário, {
    onDelete: "CASCADE",
  })
  patrocinador: Patrocinador;

  @CreateDateColumn()
  data_criação: Date;
}
