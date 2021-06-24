import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePassswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
