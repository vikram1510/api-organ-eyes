import { NextFunction, Request } from 'express';

export function test(req: Request, res: Response, next: NextFunction){
  console.log('hi');
}
