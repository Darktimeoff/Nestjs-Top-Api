import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateReviewDto } from './../src/review/dto/create-review.dto';
import { Types } from 'mongoose';
import { AppModule } from './../src/app.module';

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

    await request(app.getHttpServer()).delete(`/review/${createdId}/`);
  });

  afterAll(() => {
    app.close();
  });
});
