import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection, FindManyOptions, Repository } from 'typeorm';
import { List, listType } from './entities/List';
import { Task, taskType } from './entities/Task';
import { ApolloServer, gql, IResolvers } from 'apollo-server-express';
import { listResolver } from './resolvers/lists';
import { taskResolver } from './resolvers/tasks';
const port = 4000;
const app = express();

createConnection().then(connection => {
  const listModel = connection.getRepository(List);
  const taskModel = connection.getRepository(Task);

  app.get('/', (_, res) => res.send('hello'));
  app.use(cors());
  app.use(bodyParser.json());

  const typeDefs = gql`
    ${listType}
    ${taskType}
    type Message {
      message: String!
    }
    type Query {
      getList(id: Int!): List!
      getLists: [List!]!
      getTask(id: Int!): Task!
      getTasks: [Task!]!
    }

    type Mutation {
      createList(listCreate: ListCreate!): List!
      updateList(id: Int!, listUpdate: ListUpdate!): List!
      deleteList(id: Int!): Message!
      createTask(taskCreate: TaskCreate!): Task!
      updateTask(id: Int!, taskUpdate: TaskUpdate!): Task!
      deleteTask(id: Int!): Message!
    }
  `;

  const resolvers = [listResolver, taskResolver] as IResolvers[];
  const server = new ApolloServer({ typeDefs, resolvers, context: { db: { lists: listModel, tasks: taskModel } } });
  
  server.applyMiddleware({ app, cors: false, bodyParserConfig: false });

  app.listen(port, '0.0.0.0', () => console.log('Listening on port: ' + port));
})
  .catch(console.log);


