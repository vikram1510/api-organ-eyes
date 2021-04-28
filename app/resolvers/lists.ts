import { UserInputError } from 'apollo-server-express';
import { Resolvers } from '../types/generated';
import { Context } from '../types';

export const listResolver: Resolvers<Context> = {
  Query: {
    async getList(_parent, args, context){
      const list = await context.db.lists.findOne({ relations: ['tasks'], where: { id: args.id } });
      if (!list) throw new UserInputError('Invalid List Id');
      return list;
    },
    getLists(_parent, _args, context){
      return context.db.lists.find();
    }
  },
  Mutation: {
    async updateList(_parent, { id, listUpdate: { tasks: taskIds, name } }, { db }) {
      if (!taskIds && !name) throw new UserInputError('Please specify atleast one input argument');
      const list = await db.lists.findOne({ where: { id } });
      if (!list) throw new UserInputError('Invalid list Id');
      let updatedList = db.lists.create(list);
      if (taskIds){
        const tasks = await db.tasks.findByIds(taskIds);
        updatedList = { ...updatedList, tasks };
      }
      if (name){
        updatedList = { ...updatedList, name };
      }
      return db.lists.save(updatedList);
    },
    async createList(_parent, args, { db }) {
      const tasks = await db.tasks.findByIds(args.listCreate.tasks);
      return db.lists.save({ ...args.listCreate, tasks });
    },
    async deleteList(_parent, { id }, { db }){
      try {
        await db.lists.delete({ id });
      } catch (e){
        console.log(e);
        throw new UserInputError('Something went wrong');
      }
      return {
        deletedId: id,
        message: 'List deleted'
      };
    }
  },
  List: {
    // beauty
    async tasks(list, _args, { db }){
      return db.tasks.find({ where: { listId: list.id } });
    }
  }
};
