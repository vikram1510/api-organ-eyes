import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { List } from "./List";

@Entity({ name: 'tasks' })
export class Task {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => List, list => list.tasks)
    list!: List;

}
