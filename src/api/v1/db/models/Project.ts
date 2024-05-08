import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Index,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp,
} from "typeorm";
import { Time } from "./Time";
import { Task } from "./Task";
import { User } from "./User";
import { Run } from "./Run";
import { Model } from "./Model";
import { Dataset } from "./Dataset";
import { ulid } from "ulid";

enum ProjectStatus {
  NO_DATA = "NO DATA",
  NO_MODEL = "NO MODEL",
  TRAINING = "TRAINING",
  MODEL_OUTDATED = "MODEL OUTDATED",
  MODEL_UP_TO_DATE = "MODEL UP TO DATE",
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    default: "60",
  })
  trainingTime: string;

  @Column({
    default: "NO DATA",
  })
  status: string;

  @Index()
  @Column({
    type: "enum",
    enum: Task,
    default: Task.IMAGE_CLASSIFICATION,
  })
  task: Task;

  @Column({
    default: null,
  })
  datasetUploadedAt: Date;

  @Column({
    default: null,
  })
  modelTrainedAt: Date;

  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @OneToMany(() => Run, (run) => run.project, {
    cascade: true,
  })
  runs: Run[];

  @OneToMany(() => Dataset, (dataset) => dataset.project, {
    cascade: true,
  })
  datasets: Dataset[];

  // Tạm thời dể như này, cần phải thêm model version
  // make a float column
  @Column({
    type: "float",
    nullable: true,
    default: 0,
  })
  validation_accuracy: number;
}
