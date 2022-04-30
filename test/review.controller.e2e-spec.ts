import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateReviewDto } from './../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { AppModule } from './../src/app.module';
import { REVIEW_NOT_FOUND } from './../src/review/review.constants';
import { AuthDto } from './../src/auth/dto/auth.dto';
import { AuthService } from './../src/auth/auth.service';

const productId = new Types.ObjectId().toHexString();

const createDTO: CreateReviewDto = {
  name: 'Vasya',
  description: 'Description',
  title: 'Title',
  rating: 3,
  productId,
};

const authDto: AuthDto = {
  login: 'test555@gmail.com',
  password: 'test55',
};

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).post('/auth/register/').send(authDto);
    const { body } = await request(app.getHttpServer())
      .post('/auth/login/')
      .send(authDto);

    token = body.token;
  });

  it('/review/create/ (POST)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/review/create/')
      .send(createDTO);

    createdId = body._id;

    expect(statusCode).toBe(201);
    expect(createdId).toBeDefined();
  });

  it('/review/create/ (POST) - fail', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/review/create/')
      .send({ ...createDTO, rating: 0 });

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message.length).toBeGreaterThanOrEqual(1);
  });

  it('/review/product/:id/ (GET)', async () => {
    const { statusCode, body } = await request(app.getHttpServer()).get(
      `/review/product/${productId}/`,
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(1);
  });

  it('/review/product/:id/ (GET) with unexting id', async () => {
    const id = new Types.ObjectId().toHexString();

    const { statusCode, body } = await request(app.getHttpServer()).get(
      `/review/product/${id}/`,
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toEqual(0);
  });

  it('/review/delete/ (DELETE)', async () => {
    const { statusCode } = await request(app.getHttpServer())
      .delete(`/review/${createdId}/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(200);
  });

  it('/review/delete/ (DELETE) with unexiting id', async () => {
    const id = new Types.ObjectId().toHexString();
    const { statusCode, body } = await request(app.getHttpServer())
      .delete(`/review/${id}/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: REVIEW_NOT_FOUND,
    });
  });

  afterAll(async () => {
    await authService.removeUser(authDto.login);
    await disconnect();
    await app.close();
  });
});
