import { createConnection } from 'typeorm';

export default function attachModels(){
  console.log('hi');

  return async (req: any, res: any, next: any) => {
    const models = await createConnection({ type: 'mysql', host: 'db', port: 3306, username: 'root' });
    console.log(models);
    req.models = models;
    next();
  };

}
