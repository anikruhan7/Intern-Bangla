import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

export const GetUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
