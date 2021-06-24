import { Expose } from 'class-transformer';
import { Role } from '../../users/entity/role.entity';

export class UserRoleDoc {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'role' })
  role: Role;
}
