import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { AuthService } from './../src/auth/auth.service';
import * as request from 'supertest';
import { AuthDto } from './../src/auth/dto/auth.dto';
import { disconnect } from 'mongoose';
import {
  USER_EXISTS,
  USER_NOT_FOUND,
  USER_WRONG_PASSWORD,
} from './../src/auth/auth.constants';

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

  it('/auth/login/ (POST) - success', async () => {
    await request(app.getHttpServer()).post('/auth/register/').send(authDto);
    const { body, statusCode } = await request(app.getHttpServer())
      .post('/auth/login/')
      .send(authDto);

    expect(statusCode).toBe(200);
    expect(body.token).toBeTruthy();
  });

  it('/auth/login/ (POST) - failed, invalid data', async () => {
    const { body, statusCode } = await request(app.getHttpServer())
      .post('/auth/login/')
      .send({ ...authDto, login: 123123 });

    expect(statusCode).toBe(400);
    expect(body.error).toBeTruthy();
    expect(body.message.length).toBeGreaterThanOrEqual(1);
  });

  it('/auth/login/ (POST) - failed, user not found', async () => {
    const { body, statusCode } = await request(app.getHttpServer())
      .post('/auth/login/')
      .send({ login: 'test25@gmail.com', password: 'asdas' });

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(body.message).toBe(USER_NOT_FOUND);
  });

  it('/auth/login/ (POST) - failed, incorrect password', async () => {
    const { body, statusCode } = await request(app.getHttpServer())
      .post('/auth/login/')
      .send({ ...authDto, password: 'test12312' });

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(body.message).toBe(USER_WRONG_PASSWORD);
  });

  afterAll(async () => {
    await authService.removeUser(authDto.login);
    await disconnect();
    await app.close();
  });
});
