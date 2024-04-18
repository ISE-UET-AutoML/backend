import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, PrimaryColumn, OneToOne, JoinColumn} from "typeorm"
import {Project} from "./Project";
import { ulid } from "ulid";
import { Run } from "./Run";
@Entity()
export class Model {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    status: string

    @Column()
    url: string

    @OneToOne(() => Run, (run) => run.model)
    @JoinColumn()
    run : Run
}