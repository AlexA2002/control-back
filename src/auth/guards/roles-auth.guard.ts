import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;
    const usersRole = (await this.usersService.findUser({ id: user.sub })).role;
    const hasRole = roles.indexOf(usersRole.roleName) > -1;
    return user && hasRole;
  }
}
