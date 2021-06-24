import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { Connection, Repository } from 'typeorm';
import { WhiteListedTokens } from '../entity/whitelisted-tokens.entity.';
import { AuthService } from '../services/auth.service';
import * as faker from 'faker';
import { UnauthorizedException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockUserService = Partial<Record<keyof UsersService, jest.Mock>>;
type MockJwtService = Partial<Record<keyof JwtService, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
});

const createMockUsersService = (): MockUserService => ({
  findUser: jest.fn(),
});

const createMockJwtService = (): MockJwtService => ({
  sign: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: MockUserService;
  let jwtService: MockJwtService;
  let tokenRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: Connection, useValue: {} },
        { provide: JwtService, useValue: createMockJwtService() },
        { provide: UsersService, useValue: createMockUsersService() },
        {
          provide: getRepositoryToken(WhiteListedTokens),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    tokenRepository = module.get<MockRepository>(
      getRepositoryToken(WhiteListedTokens)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    describe('when given an incorrect email', () => {
      it('should return null', async () => {
        usersService.findUser.mockReturnValue(undefined);
        const result = await service.validateUser('mail', 'pass');
        expect(result).toBeNull();
      });
    });
  });
  describe('when the password does not match', () => {
    it('should return null', async () => {
      usersService.findUser.mockReturnValue({ password: 'hashedpass' });
      const result = await service.validateUser('mail', 'pass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    describe('when given an incorrect email', () => {
      it('should throw and Unauthorized Exception', async () => {
        usersService.findUser.mockReturnValue(undefined);
        try {
          const result = await service.logIn(loginDto);
        } catch (error) {
          expect(error).toBeInstanceOf(UnauthorizedException);
        }
      });
    });
    describe('when given the correct credentials', () => {
      it('should return an accesToken', async () => {
        usersService.findUser.mockReturnValue({ undefined });
        tokenRepository.save.mockReturnValue({});
        const result = await service.logIn(loginDto);
        const expectedResult = { data: { accesToken: undefined } };
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('logout', () => {
    const bearerToken = 'Bearer random.random.random';
    it('should logout the user', async () => {
      tokenRepository.delete.mockReturnValue({});
      const expectedResult = {
        statusCode: '200',
        message: 'Succesfully loggedOut',
      };
      const result = await service.logout(bearerToken);
      expect(result).toEqual(expectedResult);
    });
  });
});
