import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { List } from './entities/List'
const port = 4000;
const app = express();

createConnection().then(connection => {
  const list = connection.getRepository(List);

  app.use(bodyParser.json());
  app.use(cors)
  
  app.get('/', (_, res) => res.send('hello'));

  app.get('/lists', (_, res) => {
    list.find().then(res.json)
  });

  app.listen(port, '0.0.0.0', () => console.log('Listening on port: ' + port));
})
  .catch(console.log);


