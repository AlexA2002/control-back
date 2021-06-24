import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as faker from 'faker';

describe('Users module (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: process.env.TYPEORM_TEST_CONNECTION as any,
            host: process.env.TYPEORM_TEST_HOST,
            port: parseInt(process.env.TYPEORM_TEST_PORT),
            username: process.env.TYPEORM_TEST_USERNAME,
            password: process.env.TYPEORM_TEST_PASSWORD,
            database: process.env.TYPEORM_TEST_DATABASE,
            autoLoadEntities: true,
            synchronize: true,
          }),
        }),
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('/api/v1/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
