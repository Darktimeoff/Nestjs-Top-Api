import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { AuthService } from './../src/auth/auth.service';
import * as request from 'supertest';
import { AuthDto } from './../src/auth/dto/auth.dto';
import { disconnect } from 'mongoose';
import { USER_EXISTS } from './../src/auth/auth.constants';

const authDto: AuthDto = {
  login: 'test1@gmail.com',
  password: 'test',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register/ (POST) - success', async () => {
    const { body, statusCode } = await request(app.getHttpServer())
      .post('/auth/register/')
      .send(authDto);

    expect(statusCode).toBe(200);
    expect(body).toBeDefined();
    expect(body.email).toBeDefined();
  });

  it('/auth/register/ (POST) - failed, user exist', async () => {
    const { body, statusCode } = await request(app.getHttpServer())
      .post('/auth/register/')
      .send(authDto);

    expect(statusCode).toBe(400);
    expect(body).toBeDefined();
    expect(body.message).toBe(USER_EXISTS);
  });

  it('/auth/register/ (POST) - invalid data', async () => {
    const { body, statusCode } = await request(app.getHttpServer())
      .post('/auth/register/')
      .send({ ...authDto, login: 12312 });

    expect(statusCode).toBe(400);
    expect(body.error).toBeTruthy();
    expect(body.message.length).toBeGreaterThanOrEqual(1);
  });

  afterAll(async () => {
    await authService.removeUser(authDto.login);
    await disconnect();
    await app.close();
  });
});
