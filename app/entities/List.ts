import { gql } from 'apollo-server-express';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';

import { Task } from './Task';

export const listType = gql`
  input ListUpdate {
    name: String,
    tasks: [Int!]
  },
  input ListCreate {
    name: String!,
    tasks: [Int!]!
  }
  type List {
    id: Int!
    name: String!
    tasks: [Task!]!
  }
`;

@Entity({ name: 'lists' })
export class List {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(() => Task, task => task.list)
    tasks!: Task[];

}
