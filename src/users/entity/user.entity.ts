import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { WhiteListedTokens } from 'src/auth/entity/whitelisted-tokens.entity.';
import { UUID } from './uuid.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => WhiteListedTokens, (token) => token.user, {
    cascade: true,
  })
  whiteLisedTokens: WhiteListedTokens[];

  @OneToMany(() => UUID, (uuid) => uuid.user)
  uuids: UUID[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
