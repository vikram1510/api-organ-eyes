import { UserInputError } from 'apollo-server-express';
import { Resolvers } from '../generated';
import { Context } from '../types';

export const listResolver: Resolvers<Context> = {
  Query: {
    async getList(_parent, args, context){
      const list = await context.db.list.findOne({ relations: ['tasks'], where: { id: args.id } });
      if (!list) throw new UserInputError('Invalid List Id');
      return list;
    },
    getLists(_parent, _args, context){
      return context.db.list.find();
    }
  },
  Mutation: {
    async updateList(_parent, { id, listUpdate: { tasks: taskIds, name } }, { db }) {
      if (!taskIds && !name) throw new UserInputError('Please specify atleast one input argument');
      const list = await db.list.findOne({ where: { id } });
      if (!list) throw new UserInputError('Invalid list Id');
      let updatedList = db.list.create(list);
      if (taskIds){
        const tasks = await db.task.findByIds(taskIds);
        updatedList = { ...updatedList, tasks };
      }
      if (name){
        updatedList = { ...updatedList, name };
      }
      return db.list.save(updatedList);
    },
    async createList(_parent, args, { db }) {
      const tasks = await db.task.findByIds(args.listCreate.tasks);
      return db.list.save({ ...args.listCreate, tasks });
    },
    async deleteList(_parent, { id }, { db }){
      try {
        await db.list.delete({ id });
      } catch (e){
        console.log(e);
        throw new UserInputError('Something went wrong');
      }
      return {
        message: 'List deleted'
      };
    }
  },
  List: {
    // beauty
    async tasks(list, _args, { db }){
      return db.task.find({ where: { list: list.id } });
    }
  }
};
