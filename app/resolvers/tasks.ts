import { UserInputError } from 'apollo-server-express';
import { Resolvers } from '../types/generated';
import { Context } from '../types';

export const taskResolver: Resolvers<Context> = {
  Query: {
    async getTask(_parent, { id }, { db }){
      const task = await db.task.findOne({ where: { id } });
      if (!task) throw new UserInputError('Invalid task Id');
      return task;
    },

    getTasks(_parent, _args, { db }){
      return db.task.find();
    }
  },
  Mutation: {
    async updateTask(_parent, { id, taskUpdate: { name, list: listId } }, { db }) {
      const task = await db.task.findOne({ where: { id } });
      if (!task) throw new UserInputError('Invalid task Id');
      let updatedTask = db.task.create(task);
      if (name){
        updatedTask = { ...updatedTask, name };
      }
      if (listId){
        const list = await db.list.findOne({ where: { id: listId } });
        if (list) updatedTask = { ...updatedTask, list };
      }
      return db.task.save(updatedTask);
    },

    async createTask(_parent, { taskCreate: { name, list: listId } }, { db }){
      const newTask = db.task.create({ name });
      if (listId) {
        const list = await db.list.findOne({ where: { id: listId } });
        if (list) newTask.list = list;
      }
      return db.task.save(newTask);
    },

    async deleteTask(_parent, { id }, { db }){
      try {
        await db.task.delete({ id });
      } catch (e){
        console.log(e);
        throw new UserInputError('Something went wrong');
      }
      return {
        message: 'Task deleted'
      };
    }
  }


};
