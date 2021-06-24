import { CreateUserDto } from './create-user.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

class PartialCreateUser extends PartialType(CreateUserDto) {}
export class UpdateUserDto extends OmitType(PartialCreateUser, ['password']) {}
