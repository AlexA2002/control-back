import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { WhiteListedTokens } from '../entity/whitelisted-tokens.entity.';

@Injectable()
export class WhiteListGuard implements CanActivate {
  constructor(
    @InjectRepository(WhiteListedTokens)
    private readonly WhiteListedTokensRepo: Repository<WhiteListedTokens>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const {
      headers: { authorization },
    } = req;
    const accesToken = authorization.split(' ')[1];
    const valid = await this.WhiteListedTokensRepo.findOne({ accesToken });
    if (!valid) throw new UnauthorizedException();
    return true;
  }
}
