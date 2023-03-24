import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

export interface UserRequest extends Request {
  user?: User;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: UserRequest = ctx.switchToHttp().getRequest();
    return request.user
  },
);
