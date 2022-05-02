import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect, Types } from 'mongoose';
import { AuthDto } from './../src/auth/dto/auth.dto';
import { AuthService } from './../src/auth/auth.service';
import { CreateProductDto } from './../src/product/dto/create-product.dto';
import { ID_VALIDATION_ERROR } from './../src/pipe/id-validation.contstants';
import { PRODUCT_NOT_FOUND } from './../src/product/product.contstants';
import { CreateReviewDto } from './../src/review/dto/create-review.dto';
import { FindProductDto } from './../src/product/dto/find-product.dto';
import { ProductModel } from './../src/product/product.model';
import { ReviewModel } from './../src/review/review.model';

const authDto: AuthDto = {
  login: 'test@gmail.com',
  password: 'test55',
};

const createReviewDTO: CreateReviewDto = {
  name: 'Vasya',
  description: 'Description',
  title: 'Title',
  rating: 3,
  productId: '123',
};

const createProductDto: CreateProductDto = {
  image: '1.png',
  title: 'Test',
  price: 100,
  oldPrice: 120,
  credit: 10,
  description: 'Описание продукта',
  advantages: 'Преимущества продукта',
  disAdvantages: 'Недостатки продукта',
  categories: ['тест'],
  tags: ['тег'],
  characteristics: [
    {
      name: 'Характеристика 1',
      value: '1',
    },
    {
      name: 'Характеристика 2',
      value: '2',
    },
  ],
};

const findProductDto: FindProductDto = {
  category: createProductDto.categories[0],
  limit: 10,
};

const patchProductDto: Partial<CreateProductDto> = {
  title: 'PATCH TITLE',
};

describe('ProductControllet /product (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let authService: AuthService;
  let productId: string;

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

  it('/create/ (POST)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/product/create/')
      .send(createProductDto)
      .set('Authorization', `Bearer ${token}`);

    productId = body._id;

    expect(statusCode).toBe(HttpStatus.CREATED);
    expect(body._id).toBeTruthy();
  });

  it('/create/ (POST) - failed, unauthorized', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/product/create/')
      .send(createProductDto);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/create/ (POST) failed, with uncorrect format data', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/product/create/')
      .send({
        ...createProductDto,
        image: 1231,
        price: undefined,
        description: undefined,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message.length).toBeGreaterThanOrEqual(1);
  });

  it('/:id (GET)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .get(`/product/${productId}/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body._id).toBe(productId);
  });

  it('/:id (GET) - failed, unauthorized', async () => {
    const { statusCode } = await request(app.getHttpServer()).get(
      `/product/${productId}/`,
    );

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/:id (GET) - failed ucorrect format id', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .get(`/product/${productId}1/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message).toBe(ID_VALIDATION_ERROR);
  });

  it('/:id (GET) - failed, not found', async () => {
    const id = new Types.ObjectId().toHexString();
    const { statusCode, body } = await request(app.getHttpServer())
      .get(`/product/${id}/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body.message).toBe(PRODUCT_NOT_FOUND);
  });

  it('/:id (PATCH)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .patch(`/product/${productId}/`)
      .send(patchProductDto)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body._id).toBe(productId);
    expect(body.title).toBe(patchProductDto.title);
  });

  it('/:id (PATCH) - failed, unauthorized', async () => {
    const { statusCode } = await request(app.getHttpServer())
      .patch(`/product/${productId}/`)
      .send(patchProductDto);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/:id (PATCH) - failed uncorrect format id', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .patch(`/product/${productId}1/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message).toBe(ID_VALIDATION_ERROR);
  });

  it('/:id (PATCH) - failed, not found', async () => {
    const id = new Types.ObjectId().toHexString();
    const { statusCode, body } = await request(app.getHttpServer())
      .patch(`/product/${id}/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body.message).toBe(PRODUCT_NOT_FOUND);
  });

  it('/find/ (POST)', async () => {
    let reviewId: string;
    createReviewDTO.productId = productId;

    const { body } = await request(app.getHttpServer())
      .post('/review/create/')
      .send(createReviewDTO);
    reviewId = body._id;

    const { statusCode, body: pBody } = await request(app.getHttpServer())
      .post('/product/find/')
      .send(findProductDto);
    const product: ProductModel & {
      _id: string;
      reviews: ReviewModel & { _id: string }[];
      reviewCount: number;
      reviewAvg: number;
      //@ts-ignore
    } = pBody.find((p) => p._id == productId);
    const review = product.reviews[0];

    expect(statusCode).toBe(HttpStatus.OK);
    expect(product._id).toBe(productId);
    expect(product.price).toBe(createProductDto.price);
    expect(product.reviewCount).toBe(1);
    expect(product.reviewAvg).toBe(createReviewDTO.rating);
    expect(review._id).toBe(reviewId);

    await request(app.getHttpServer())
      .delete(`/review/${reviewId}/`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('/find/ (POST) - success, not found review for product', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/product/find/')
      .send(findProductDto);
    const product: ProductModel & {
      _id: string;
      reviews: ReviewModel & { _id: string }[];
      reviewCount: number;
      reviewAvg: number;
    } = body[0];

    expect(statusCode).toBe(HttpStatus.OK);
    expect(product.reviewCount).toBe(0);
    expect(product.reviewAvg).toBeNull();
  });

  it('/find/ (POST) - success, not found product with categories', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/product/find/')
      .send({ ...findProductDto, category: '123' });

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(0);
  });

  it('/find/ (POST) - failed, ucorrect body data', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/product/find/')
      .send({ ...findProductDto, category: undefined });

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message.length).toBeGreaterThanOrEqual(1);
  });

  it(`/:id (DELETE)`, async () => {
    const { statusCode } = await request(app.getHttpServer())
      .delete(`/product/${productId}/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(200);
  });

  it(`/:id (DELETE) - failed, witout authorization`, async () => {
    const { statusCode } = await request(app.getHttpServer()).delete(
      `/product/${productId}/`,
    );

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it(`/:id (DELETE) - failed, uncorrect format id`, async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .delete(`/product/${productId}1/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message).toBe(ID_VALIDATION_ERROR);
  });

  it(`/:id (DELETE) - failed, not found id`, async () => {
    const id = new Types.ObjectId().toHexString();
    const { statusCode, body } = await request(app.getHttpServer())
      .delete(`/product/${id}/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body.message).toBe(PRODUCT_NOT_FOUND);
  });

  afterAll(async () => {
    await authService.removeUser(authDto.login);
    await disconnect();
    await app.close();
  });
});
