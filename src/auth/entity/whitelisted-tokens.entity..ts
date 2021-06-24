import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WhiteListedTokens {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accesToken: string;

  @ManyToOne(() => User, (user) => user.whiteLisedTokens)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
