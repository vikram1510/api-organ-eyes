import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection, FindManyOptions } from 'typeorm';
import { List } from './entities/List'
import { Task } from './entities/Task';
const port = 4000;
const app = express();

createConnection().then(connection => {
  const listModel = connection.getRepository(List);
  const taskModel = connection.getRepository(Task);

  app.use(bodyParser.json());
  app.use(cors())
  
  app.get('/', (_, res) => res.send('hello'));

  app.get('/lists', (_, res) => listModel.find({ relations: ['tasks']}).then(result => res.json(result)));
  app.get('/list', (req, res) => listModel.findOne({ id : req.body.id }).then(result => res.json(result)));
  app.post('/lists', (req, res) => {
    const list = listModel.create(req.body)
    listModel.save(list).then(result => res.json(result)).catch(err => res.json(err))
  })

  app.patch('/lists/:listId', async (req, res) => {
    const list = await listModel.findOne({ id: Number(req.params.listId) })
    if (!list) return res.status(400).send({ message: 'Could not find list' })
    // if ('tasks' in req.body){
    //   list.tasks = await taskModel.findByIds(req.body.tasks)
    //   delete req.body.tasks
    // }
    const newList = await listModel.save({...list, ...req.body })
    res.json(newList)
  })

  app.post('/tasks', async (req, res) => {
    const list = await listModel.findOne( { id: req.body.list })
    delete req.body.list;
    const result = await taskModel.save({...req.body, list })
    res.json(result)
  })

  app.patch('/tasks/:taskId', async (req, res) => {
    const task = await taskModel.findOne({ id: Number(req.params.taskId)})
    if (!task) return res.status(400).send({ message: 'Could not find task' })
    const newtask = await taskModel.save({...task, ...req.body })
    res.json(newtask)
  })

  app.listen(port, '0.0.0.0', () => console.log('Listening on port: ' + port));
})
  .catch(console.log);


