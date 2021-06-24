import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserRoleDoc } from '../doc/user-role.doc';
import { UserDoc } from '../doc/user.doc';
import { Role } from '../entity/role.entity';
import { User } from '../entity/user.entity';
import { RoleService } from './role.service';
import { UsersService } from './users.service';
import * as faker from 'faker';
import { WhiteListedTokens } from 'src/auth/entity/whitelisted-tokens.entity.';
import { UUID } from '../entity/uuid.entity';
import { UtilsService } from 'src/utils/utils.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockRoleService = Partial<Record<keyof RoleService, jest.Mock>>;
type MockUtilsService = Partial<Record<keyof UtilsService, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
});

const createMockRoleService = (): MockRoleService => ({
  findRoleOrThrow: jest.fn(),
});

const createMockUtilsService = (): MockUtilsService => ({
  sendMail: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository;
  let tokenRepository: MockRepository;
  let roleService: MockRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: Connection, useValue: {} },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        { provide: getRepositoryToken(UUID), useValue: createMockRepository() },
        {
          provide: getRepositoryToken(WhiteListedTokens),
          useValue: createMockRepository(),
        },
        { provide: RoleService, useValue: createMockRoleService() },
        { provide: UtilsService, useValue: createMockUtilsService() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository>(getRepositoryToken(User));
    tokenRepository = module.get<MockRepository>(
      getRepositoryToken(WhiteListedTokens)
    );
    roleService = module.get(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUser', () => {
    const id = 1;
    describe('when the user exists', () => {
      it('should return the userObject', async () => {
        const expectedUser = {};
        userRepository.findOne.mockReturnValue(expectedUser);
        try {
          const result = await service.findUser({ id });
          expect(result).toEqual(expectedUser);
        } catch (error) {
          console.error(error);
        }
      });
    });
    describe("when the user doesn't exist", () => {
      it('should return an empty object', async () => {
        userRepository.findOne.mockReturnValueOnce(undefined);
        try {
          const result = await service.findUser({ id });
          expect(result).toBeUndefined();
        } catch (error) {
          console.error(error);
        }
      });
    });
  });

  describe('createUser', () => {
    const createUserDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    describe('when the user is unique and the client role exists', () => {
      it('should return a UserDoc', async () => {
        userRepository.findOne.mockReturnValueOnce(undefined);
        roleService.findRoleOrThrow.mockReturnValueOnce({});
        userRepository.save.mockReturnValueOnce({});
        try {
          const result = await service.createUser(createUserDto);
          expect(result).toBeInstanceOf(UserDoc);
        } catch (error) {
          console.error(error);
        }
      });
    });
    describe('when the email is already taken', () => {
      it('should throw a ConflictException', async () => {
        userRepository.findOne.mockReturnValueOnce({});
        try {
          service.createUser(createUserDto);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
        }
      });
    });
    describe('when the given role doesnt exist', () => {
      it('should throw a NotFoundException', async () => {
        roleService.findRoleOrThrow.mockImplementationOnce(() => {
          throw new NotFoundException();
        });
        try {
          service.createUser(createUserDto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('listUsers', () => {
    describe('when there are registered users', () => {
      it('should return a list of UserDocs', async () => {
        const expectedResult = [{}, {}, {}];
        userRepository.find.mockReturnValueOnce(expectedResult);
        try {
          const result = await service.listUsers();
          expect(result).toEqual(expect.arrayContaining(expectedResult));
        } catch (error) {
          console.error(error);
        }
      });
    });
    describe('when there are no registered users', () => {
      it('should return an empty list', async () => {
        const expectedResult = [];
        userRepository.find.mockReturnValueOnce(expectedResult);
        try {
          const result = await service.listUsers();
          expect(result).toEqual(expect.arrayContaining(expectedResult));
        } catch (error) {
          console.error(error);
        }
      });
    });
  });

  describe('getUser', () => {
    const id = 1;
    describe('when the user exists', () => {
      it('should return a UserDoc', async () => {
        userRepository.findOne.mockReturnValueOnce({});
        try {
          const result = await service.getUser(id);
          expect(result).toBeInstanceOf(UserDoc);
        } catch (error) {
          console.error(error);
        }
      });
    });
    describe("when the user doesn't exist", () => {
      it('should throw a NotFoundException', async () => {
        userRepository.findOne.mockReturnValueOnce(undefined);
        try {
          service.getUser(id);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('updateUser', () => {
    const id = 1;
    const updateUserDto = {};
    describe("when the user doesn't exist", () => {
      it('should throw a NotFoundException', async () => {
        userRepository.findOne.mockReturnValueOnce(undefined);
        try {
          service.updateUser(id, updateUserDto);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
    describe('when the email is already used', () => {
      it('should throw a ConflictException', async () => {
        userRepository.findOne.mockReturnValueOnce({});
        userRepository.findOne.mockReturnValueOnce({});
        try {
          service.updateUser(id, updateUserDto);
        } catch (error) {
          expect(error).toBeInstanceOf(ConflictException);
        }
      });
    });
    describe('otherwise', () => {
      it('should return a UserDoc', async () => {
        userRepository.findOne.mockReturnValueOnce({});
        userRepository.findOne.mockReturnValueOnce(undefined);
        userRepository.save.mockReturnValueOnce({});
        try {
          const result = await service.updateUser(id, updateUserDto);
          expect(result).toBeInstanceOf(UserDoc);
        } catch (error) {
          console.error(error);
        }
      });
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto = { email: faker.internet.email() };
    describe('when given an incorrect email', () => {
      it('should throw a BadRequestException', async () => {
        userRepository.findOne.mockReturnValueOnce(undefined);
        try {
          service.forgotPassword(forgotPasswordDto);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });
    describe('otherwise', () => {
      it('should send an email with steps', async () => {
        userRepository.findOne.mockReturnValue({});
        const expectedResult = {
          data: {
            message: `An e-mail with instructions has been sent to ${forgotPasswordDto.email}`,
          },
        };
        const result = await service.forgotPassword(forgotPasswordDto);
        expect(result).toBeDefined();
      });
    });
  });

  describe('upateUserRole', () => {
    const id = 1;
    const updateUserRoleDto = { roleName: 'client' };
    describe("when the user doesn't exist", () => {
      it('should return a NotFoundException', async () => {
        userRepository.findOne.mockReturnValueOnce(undefined);
        try {
          service.updateUserRole(id, updateUserRoleDto);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
    describe("when the role doesn't exist", () => {
      it('should throw a NotFoundException', async () => {
        userRepository.findOne.mockReturnValueOnce({});
        roleService.findRoleOrThrow.mockImplementationOnce(() => {
          throw new NotFoundException();
        });
        try {
          service.updateUserRole(id, updateUserRoleDto);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
    describe('otherwise', () => {
      it('should return a UserRoleDoc', async () => {
        userRepository.findOne.mockReturnValueOnce({});
        roleService.findRoleOrThrow.mockImplementationOnce(() => {
          return {};
        });
        try {
          const result = await service.updateUserRole(id, updateUserRoleDto);
          expect(result).toBeInstanceOf(UserRoleDoc);
        } catch (error) {
          console.error(error);
        }
      });
    });
  });

  describe('deleteUser', () => {
    const id = 1;
    describe('when given an invalid id', () => {
      it('should throw NotFoundException', async () => {
        userRepository.findOne.mockReturnValueOnce(undefined);
        try {
          service.deleteUser(id);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
      describe('when given a valid id', () => {
        it('should return nothing', async () => {
          userRepository.findOne.mockReturnValueOnce({});
          userRepository.softDelete.mockReturnValue({ affected: 1 });
          tokenRepository.delete.mockReturnValueOnce({});
          const result = await service.deleteUser(id);
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
