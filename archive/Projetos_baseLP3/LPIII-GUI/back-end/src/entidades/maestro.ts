import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import Usuário from "./usuário";
import PeçaMusical from "./peça-musical";

export enum Estilo {
  SIMPLES = "simples",
  ELEGANTE = "elegante",
}

export enum Nacionalidade {
  BRASILEIRO = "brasileiro",
  ESTRANGEIRO = "estrangeiro",
}

@Entity()
export default class Maestro extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: Estilo })
  estilo: Estilo;

  @Column()
  anos_experiência: number;

  @Column({ type: "enum", enum: Nacionalidade })
  nacionalidade: Nacionalidade;

  @OneToMany(() => PeçaMusical, (peça_musical) => peça_musical.maestro)
  peças_musicais: PeçaMusical[];

  @OneToOne(() => Usuário, (usuário) => usuário.maestro, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  usuário: Usuário;
}
