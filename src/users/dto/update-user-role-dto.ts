import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  roleName: string;
}
