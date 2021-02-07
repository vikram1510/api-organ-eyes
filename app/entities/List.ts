import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany} from "typeorm";

import {Task } from './Task'

@Entity({ name: 'lists' })
export class List {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(() => Task, task => task.list)
    tasks!: Task[];

}
