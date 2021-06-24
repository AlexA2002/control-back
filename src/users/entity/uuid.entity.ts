import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UUID {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @ManyToOne(() => User, (user) => user.uuids)
  user: User;
}
