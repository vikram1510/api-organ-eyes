import { Repository } from 'typeorm';
import { List } from './entities/List';
import { Task } from './entities/Task';

export type Context = {
  db: {
    list: Repository<List>,
    task: Repository<Task>
  }
}
