import { Expose } from 'class-transformer';

export class UserDoc {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'createdAt' })
  createdAt: Date;

  @Expose({ name: 'updatedAt' })
  updatedAt: Date;
}
