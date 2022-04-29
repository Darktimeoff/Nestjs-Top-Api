import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateReviewDto } from './../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { AppModule } from './../src/app.module';
import { REVIEW_NOT_FOUND } from './../src/review/review.constants';

const productId = new Types.ObjectId().toHexString();

const createDTO: CreateReviewDto = {
  name: 'Vasya',
  description: 'Description',
  title: 'Title',
  rating: 3,
  productId,
};

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create/ (POST)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/review/create/')
      .send(createDTO);

    createdId = body._id;

    expect(statusCode).toBe(201);
    expect(createdId).toBeDefined();
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
    const { statusCode } = await request(app.getHttpServer()).delete(
      `/review/${createdId}/`,
    );

    expect(statusCode).toBe(200);
  });

  it('/review/delete/ (DELETE) with unexiting id', async () => {
    const id = new Types.ObjectId().toHexString();
    const { statusCode, body } = await request(app.getHttpServer()).delete(
      `/review/${id}/`,
    );

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: REVIEW_NOT_FOUND,
    });
  });

  afterAll(() => {
    disconnect();
    app.close();
  });
});
