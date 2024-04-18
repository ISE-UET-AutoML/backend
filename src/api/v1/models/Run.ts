import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, OneToOne, JoinColumn} from "typeorm"
import {User} from "./User";
import {Project} from "./Project";
import { ulid } from "ulid";
import { Model } from './Model';

@Entity()
export class Run {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: ""
    })
    name: string

    @Column({
        default: "IN PROGRESS"
    })
    status: string

    @Column({
        default: ""
    })
    best_model_url: string

    @Column({
        type: "float",
        default: 0
    })
    train_accuracy: number

    @Column({
        type: "float",
        default: 0
    })
    train_loss: number

    @Column({
        type: "float",
        default: 0
    })
    val_accuracy: number

    @Column({
        type: "float",
        default: 0
    })
    val_loss: number

    @ManyToOne(() => Project, project => project.runs)
    project: Project

    @OneToOne(() => Model, (model) => model.run, {cascade: true, eager: true, onDelete: 'CASCADE'})
    @JoinColumn()
    model: Model
}