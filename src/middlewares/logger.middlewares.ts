import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, res: Response, next: NextFunction) {
    console.log(`This is the IP of calling: ${request.ip}`);
    next();
  }
}
