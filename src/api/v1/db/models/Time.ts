import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn} from "typeorm"
import {ulid} from "ulid";

@Entity()
export class Time {
    @CreateDateColumn({default: () => "CURRENT_TIMESTAMP"})
    created_at: Date

    @UpdateDateColumn({default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updated_at: Date

    @PrimaryGeneratedColumn("uuid")
    id: string;

}
