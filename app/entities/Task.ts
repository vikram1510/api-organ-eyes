import gql from 'graphql-tag';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { List, listType } from './List';

export const taskType = gql`
  type Task {
    id: Int!
    name: String!
    list: List!
  }
`;

@Entity({ name: 'tasks' })
export class Task {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => List, list => list.tasks)
    list!: List;

}
