import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import PeçaMusical from "./peça-musical";
import Patrocinador from "./patrocinador";

//corrigir os atributos
@Entity()
export default class Patrocínio extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orçamento_disponível: number;

  @CreateDateColumn()
  data_proposta: Date;

  @Column()
  show_exposicao: boolean;

  @ManyToOne(() => PeçaMusical, (peça_musical) => peça_musical.patrocínios, {
    onDelete: "CASCADE",
  })
  peça_musical: PeçaMusical;

  @ManyToOne(() => Patrocinador, (patrocinador) => patrocinador.patrocínios, {
    onDelete: "CASCADE",
  })
  patrocinador: Patrocinador;
}
