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
import Patrocínio from "./patrocínio";

@Entity()
export default class Patrocinador extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  empresa: string;

  @Column()
  telefone: string;

  @OneToMany(() => Patrocínio, (patrocínio) => patrocínio.patrocinador)
  patrocínios: Patrocínio[];

  @OneToOne(() => Usuário, (usuário) => usuário.patrocinador, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  usuário: Usuário;
}
