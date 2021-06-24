import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { Role } from '../entity/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  findRoleOrThrow(findConditions: FindConditions<Role>): Promise<Role> {
    const role = this.roleRepository.findOne(findConditions);
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }
}
