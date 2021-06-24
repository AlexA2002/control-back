import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../../auth/guards/roles-auth.guard';
import { WhiteListGuard } from '../../auth/guards/whitelist-auth.guard';
import { UserRoleDoc } from '../doc/user-role.doc';
import { UserDoc } from '../doc/user.doc';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserRoleDto } from '../dto/update-user-role-dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../services/users.service';
import { ChangePassswordDto } from '../dto/change-password.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/resetPassword.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserDoc> {
    return this.usersService.createUser(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, WhiteListGuard, RolesAuthGuard)
  @Roles('admin')
  @Get()
  listUsers(): Promise<UserDoc[]> {
    return this.usersService.listUsers();
  }

  @Post('password/forgot')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Post('password/reset/:uuid')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('uuid', ParseUUIDPipe) uuid: string
  ) {
    return this.usersService.resetPassword(uuid, resetPasswordDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, WhiteListGuard)
  @Get('me')
  getMyUser(@Req() req): Promise<UserDoc> {
    return this.usersService.getUser(req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, WhiteListGuard)
  @Patch('me')
  updateMyUser(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserDoc> {
    return this.usersService.updateUser(req.user.sub, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, WhiteListGuard)
  @Patch('me/password')
  changePassword(@Body() changePassswordDto: ChangePassswordDto, @Req() req) {
    return this.usersService.changePassword(changePassswordDto, req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, WhiteListGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('me')
  deleteMyUser(@Req() req): Promise<void> {
    return this.usersService.deleteUser(req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, WhiteListGuard, RolesAuthGuard)
  @Roles('admin')
  @Patch('role/:userId')
  updateUserRole(
    @Param(':userId', ParseIntPipe) userId: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ): Promise<UserRoleDoc> {
    return this.usersService.updateUserRole(userId, updateUserRoleDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, WhiteListGuard, RolesAuthGuard)
  @Roles('admin')
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number): Promise<UserDoc> {
    return this.usersService.getUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, WhiteListGuard, RolesAuthGuard)
  @Roles('admin')
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserDoc> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, WhiteListGuard, RolesAuthGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
