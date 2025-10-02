import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Patrocínio from "./patrocínio";
import Maestro from "./maestro";

export enum Gênero {
  CLÁSSICO = "clássico",
  POP = "pop",
  ROCK = "rock",
}

@Entity()
export default class PeçaMusical extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  título: string;

  @Column()
  duração: number;

  @Column()
  tom: string;

  @Column({ type: "enum", enum: Gênero })
  gênero: Gênero;

  @Column()
  internacional: boolean;

  @ManyToOne(() => Maestro, (maestro) => maestro.peças_musicais, {
    onDelete: "CASCADE",
  })
  maestro: Maestro;

  @OneToMany(() => Patrocínio, (patrocínio) => patrocínio.peça_musical)
  patrocínios: Patrocínio[];
}
