import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LogInDto } from '../dto/log-in.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { WhiteListGuard } from '../guards/whitelist-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LogInDoc } from '../docs/login.doc';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() logInDto: LogInDto): Promise<LogInDoc> {
    return this.authService.logIn(logInDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, WhiteListGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req) {
    return this.authService.logout(req.headers.authorization);
  }
}
