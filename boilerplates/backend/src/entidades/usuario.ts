import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
} from "typeorm";

export enum Perfil {
  USUARIO = "usuario",
  ADMINISTRADOR = "administrador",
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

@Entity()
export default class Usuario extends BaseEntity {
  @PrimaryColumn()
  cpf: string;

  @Column({ type: "enum", enum: Perfil, default: Perfil.USUARIO })
  perfil: Perfil;

  @Column({ type: "enum", enum: Status, default: Status.ATIVO })
  status: Status;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  questao: string;

  @Column()
  resposta: string;

  @Column({ type: "enum", enum: Cores, default: Cores.CINZA_ESCURO })
  cor_tema: string;

  @CreateDateColumn()
  data_criacao: Date;
}
