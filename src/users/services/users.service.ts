import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';
import { compare, hash } from 'bcrypt';
import { UserDoc } from '../doc/user.doc';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserRoleDto } from '../dto/update-user-role-dto';
import { UserRoleDoc } from '../doc/user-role.doc';
import { RoleService } from './role.service';
import { plainToClass } from 'class-transformer';
import { WhiteListedTokens } from 'src/auth/entity/whitelisted-tokens.entity.';
import { ChangePassswordDto } from '../dto/change-password.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { UtilsService } from 'src/utils/utils.service';
import { UUID } from '../entity/uuid.entity';
import { ResetPasswordDto } from '../dto/resetPassword.dto';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WhiteListedTokens)
    private readonly tokenRepository: Repository<WhiteListedTokens>,
    @InjectRepository(UUID)
    private readonly uuidRepository: Repository<UUID>,
    private readonly roleService: RoleService,
    private readonly utilsService: UtilsService
  ) {}

  findUser(
    findConditions: FindConditions<User>,
    findOptions: FindOneOptions = { relations: ['role'] }
  ): Promise<User> {
    return this.userRepository.findOne(findConditions, findOptions);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDoc> {
    const existingUser = await this.findUser({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const encryptedPassword = await hash(
      createUserDto.password,
      this.saltRounds
    );
    const userRole = await this.roleService.findRoleOrThrow({
      roleName: 'client',
    });
    const user = {
      ...createUserDto,
      role: userRole,
      password: encryptedPassword,
    };
    return plainToClass(UserDoc, await this.userRepository.save(user), {
      excludeExtraneousValues: true,
    });
  }

  async listUsers(): Promise<UserDoc[]> {
    return (await this.userRepository.find()).map((user) =>
      plainToClass(UserDoc, user, { excludeExtraneousValues: true })
    );
  }

  async getUser(id: number): Promise<UserDoc> {
    const user = await this.findUser({ id });
    if (!user) throw new NotFoundException(`User with id #${id} not found`);
    return plainToClass(UserDoc, user, { excludeExtraneousValues: true });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserDoc> {
    const user = await this.findUser({ id });
    if (!user) throw new NotFoundException(`User with id #${id} not found`);
    if (updateUserDto.email) {
      const existingUser = await this.findUser({ email: updateUserDto.email });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
      user.email = updateUserDto.email;
    }
    const updatedUser = await this.userRepository.save(user);
    return plainToClass(UserDoc, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      email: forgotPasswordDto.email,
    });
    if (!user) {
      throw new BadRequestException(
        `The user ${forgotPasswordDto.email} is not registered`
      );
    }
    const uuid = {
      uuid: uuidv4(),
      user,
    };
    await this.uuidRepository.save(uuid);
    this.utilsService.sendMail({
      from: '"Movie Rental" <MovieRental@trainne.com>',
      to: user.email,
      subject: 'Reset your password ✔',
      text: 'Follow the next steps to reset your password:',
      html: `
      Hi! it seems you've requested to reset you password, to do so, follow these steps<br><br>
      1. Make a post request http://localhost:${process.env.SERVER_PORT}/users/password/reset/${uuid.uuid} <br>
      2. Fill in the body with your new password <br>
      3. Send the request <br>
      4. Done! Your password has been reset <br>
    `,
    });
    return {
      data: {
        message: `An e-mail with instructions has been sent to ${user.email}`,
      },
    };
  }

  async resetPassword(uuid: string, resetPasswordDto: ResetPasswordDto) {
    const exisitingUuid = await this.uuidRepository.findOne(
      { uuid },
      { relations: ['user'] }
    );
    if (!exisitingUuid) {
      throw new BadRequestException('The uuid is not active');
    }
    const user = await this.userRepository.findOne({
      id: exisitingUuid.user.id,
    });
    if (!user) {
      throw new BadRequestException(
        'The  associated user no longer has an account'
      );
    }
    const samePassword = await compare(
      resetPasswordDto.newPassword,
      user.password
    );
    if (samePassword) {
      return {
        data: {
          message: 'The new password must be different from the actual',
        },
      };
    }
    user.password = await hash(resetPasswordDto.newPassword, this.saltRounds);
    await this.userRepository.save(user);
    await this.uuidRepository.delete({ uuid });
    return {
      data: {
        message: 'The password has been reset',
      },
    };
  }

  async changePassword(changePassswordDto: ChangePassswordDto, userId: number) {
    if (changePassswordDto.currentPassword === changePassswordDto.newPassword) {
      throw new BadRequestException(
        'The new password must be different from the actual'
      );
    }
    const user = await this.findUser({ id: userId });
    const passwordMatch = await compare(
      changePassswordDto.currentPassword,
      user.password
    );
    if (!passwordMatch) {
      throw new BadRequestException('Current Password does not match');
    }
    user.password = await hash(changePassswordDto.newPassword, this.saltRounds);
    await this.userRepository.save(user);
    return {
      data: {
        message: 'Your new password has been set',
      },
    };
  }

  async updateUserRole(
    id: number,
    updateUserRoleDto: UpdateUserRoleDto
  ): Promise<UserRoleDoc> {
    const user = await this.findUser({ id });
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }
    const newRole = await this.roleService.findRoleOrThrow({
      roleName: updateUserRoleDto.roleName,
    });
    user.role = newRole;
    this.userRepository.save(user);
    const plain = {
      id: user.id,
      email: user.email,
      role: newRole,
    };
    return plainToClass(UserRoleDoc, plain, { excludeExtraneousValues: true });
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findUser({ id });
    if (!user) throw new NotFoundException(`User with id #${id} not found`);
    const result = await this.userRepository.softDelete({ id });
    await this.tokenRepository.delete({ user });
    if (result.affected !== 1) {
      throw new InternalServerErrorException(
        'Something went wrong, try again later'
      );
    }
    return;
  }
}
