import { Repository } from 'typeorm';
import { List } from '../entities/List';
import { Task } from '../entities/Task';

export type Context = {
  db: {
    lists: Repository<List>,
    tasks: Repository<Task>
  }
}
