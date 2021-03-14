import gql from 'graphql-tag';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { List, listType } from './List';

export const taskType = gql`
  input TaskUpdate {
    name: String,
    listId: Int
  },
  input TaskCreate {
    name: String!,
    listId: Int
  }
  type Task {
    id: Int!
    name: String!
    listId: Int
    list: List
  }
`;

@Entity({ name: 'tasks' })
export class Task {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    listId!: number;

    @ManyToOne(() => List, list => list.tasks)
    list!: List;

}
