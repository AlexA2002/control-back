import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from 'src/utils/utils.module';
import { WhiteListedTokens } from '../auth/entity/whitelisted-tokens.entity.';
import { Role } from '../users/entity/role.entity';
import { UsersController } from './controllers/users.controller';
import { User } from './entity/user.entity';
import { UUID } from './entity/uuid.entity';
import { RoleService } from './services/role.service';
import { UsersService } from './services/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RoleService],
  imports: [
    UtilsModule,
    TypeOrmModule.forFeature([User, Role, UUID, WhiteListedTokens]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
