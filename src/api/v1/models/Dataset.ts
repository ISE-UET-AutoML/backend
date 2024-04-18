import { Entity, Column, ManyToOne, OneToOne, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Project } from "./Project";
import { ulid } from "ulid";

@Entity()
export class Dataset {
    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Index()
    @Column()
    bucket_url: string

    @Column()
    name: string

    @ManyToOne(() => Project, (project) => project.datasets)
    project: Project

}