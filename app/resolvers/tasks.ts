import { UserInputError } from 'apollo-server-express';
import { Resolvers } from '../types/generated';
import { Context } from '../types';

export const taskResolver: Resolvers<Context> = {
  Query: {
    async getTask(_parent, { id }, { db }){
      const task = await db.tasks.findOne({ where: { id } });
      if (!task) throw new UserInputError('Invalid task Id');
      return task;
    },
    
    async getTasks(_parent, _args, { db }){
      console.log('lol');
      const t = await db.tasks.find();
      console.log(t);
      return  t;
    }
  },
  Task: {
    list: ({ listId }, _args, { db }) => listId ? db.lists.findOneOrFail(listId) : null
  },
  Mutation: {
    async updateTask(_parent, { id, taskUpdate: { name, listId } }, { db }) {
      const task = await db.tasks.findOne({ where: { id } });
      if (!task) throw new UserInputError('Invalid task Id');
      let updatedTask = db.tasks.create(task);
      if (name){
        updatedTask = { ...updatedTask, name };
      }
      if (listId){
        updatedTask = { ...updatedTask, listId };
      }
      return db.tasks.save(updatedTask);
    },

    async createTask(_parent, { taskCreate: { name, listId } }, { db }){
      const newTask = db.tasks.create({ name });
      if (listId) {
        newTask.listId = listId;
      }
      return db.tasks.save(newTask);
    },

    async deleteTask(_parent, { id }, { db }){
      try {
        await db.tasks.delete({ id });
      } catch (e){
        console.log(e);
        throw new UserInputError('Something went wrong');
      }
      return {
        deletedId: id,
        message: 'Task deleted'
      };
    }
  }


};
