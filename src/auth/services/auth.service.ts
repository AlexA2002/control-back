import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { compare } from 'bcrypt';
import { LogInDto } from '../dto/log-in.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhiteListedTokens } from '../entity/whitelisted-tokens.entity.';
import { UserDoc } from '../../users/doc/user.doc';
import { LogInDoc } from '../docs/login.doc';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(WhiteListedTokens)
    private readonly tokenRepository: Repository<WhiteListedTokens>
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDoc> {
    const user = await this.usersService.findUser({ email });
    if (!user) return null;
    const passwordMatch = await compare(pass, user.password);
    if (user && passwordMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async logIn(logInDto: LogInDto): Promise<LogInDoc> {
    const user = await this.usersService.findUser({ email: logInDto.email });
    if (!user) throw new UnauthorizedException();
    const payload = {
      user: {
        sub: user.id,
        email: user.email,
      },
    };
    const whiteListedToken = {
      accesToken: this.jwtService.sign(payload),
      user,
    };
    this.tokenRepository.save(whiteListedToken);
    return {
      data: { accesToken: whiteListedToken.accesToken },
    };
  }

  async logout(bearerToken: string) {
    const accesToken = bearerToken.split(' ')[1];
    await this.tokenRepository.delete({ accesToken });
    return { statusCode: '200', message: 'Succesfully loggedOut' };
  }
}
