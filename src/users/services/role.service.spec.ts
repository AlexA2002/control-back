import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Role } from '../entity/role.entity';
import { RoleService } from './role.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
});

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(Role),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get<MockRepository>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findRoleOrThrow', () => {
    describe('When role with ID exists', () => {
      it('should return the role object', async () => {
        const roleId = 1;
        const expectedRole = {};

        roleRepository.findOne.mockReturnValue(expectedRole);
        const role = await service.findRoleOrThrow({ id: roleId });
        expect(role).toEqual(expectedRole);
      });
    });
    describe('otherwise', () => {
      it('should throw NotFoundException', async () => {
        const roleId = 1;
        roleRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findRoleOrThrow({ id: roleId });
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
