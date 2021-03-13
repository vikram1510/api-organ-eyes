import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection, FindManyOptions, Repository } from 'typeorm';
import { List, listType } from './entities/List';
import { Task, taskType } from './entities/Task';
import { ApolloServer, gql, IResolvers } from 'apollo-server-express';
import { listResolver } from './resolvers/lists';
const port = 4000;
const app = express();

createConnection().then(connection => {
  const listModel = connection.getRepository(List);
  const taskModel = connection.getRepository(Task);

  app.get('/', (_, res) => res.send('hello'));

  const typeDefs = gql`
    ${listType}
    ${taskType}
    type Message {
      message: String!
    }
    type Query {
      getList(id: Int!): List!
      getLists: [List!]!
      task: Task!
      tasks: [Task!]!
    }

    type Mutation {
      createList(listCreate: ListCreate!): List!
      updateList(id: Int!, listUpdate: ListUpdate!): List!
      deleteList(id: Int): Message!
    }
  `;

  const resolvers = [listResolver] as IResolvers[];
  const server = new ApolloServer({ typeDefs, resolvers, context: { db: { list: listModel, task: taskModel } } });
  
  server.applyMiddleware({ app });

  app.post('/tasks', async (req, res) => {
    const list = await listModel.findOne( { id: req.body.list });
    delete req.body.list;
    const result = await taskModel.save({ ...req.body, list });
    res.json(result);
  });

  app.patch('/tasks/:taskId', async (req, res) => {
    const task = await taskModel.findOne({ id: Number(req.params.taskId) });
    if (!task) return res.status(400).send({ message: 'Could not find task' });
    const newtask = await taskModel.save({ ...task, ...req.body });
    res.json(newtask);
  });

  app.patch('/tasks/:taskId', async (req, res) => {
    const task = await taskModel.findOne({ id: Number(req.params.taskId) });
    if (!task) return res.status(400).send({ message: 'Could not find task' });
    const newtask = await taskModel.save({ ...task, ...req.body });
    res.json(newtask);
  });

  app.delete('/tasks/:taskId', async(req, res) => {
    await taskModel.delete({ id: Number(req.params.taskId) });
    res.json({ message: 'done' });
  });

  app.listen(port, '0.0.0.0', () => console.log('Listening on port: ' + port));
})
  .catch(console.log);


