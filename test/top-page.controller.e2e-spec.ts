import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect, Types } from 'mongoose';
import { AuthDto } from './../src/auth/dto/auth.dto';
import { AuthService } from './../src/auth/auth.service';
import { CreateTopPageDto } from './../src/top-page/dto/create-top-page.dto';
import { ID_VALIDATION_ERROR } from './../src/pipe/id-validation.contstants';
import { TOP_PAGE_NOT_FOUND } from './../src/top-page/top-page.contstants';
import { FindTopPageDto } from './../src/top-page/dto/find-top-page.dto';

const authDto: AuthDto = {
  login: 'test1@gmail.com',
  password: 'test55',
};

const createTopPageDto: CreateTopPageDto = {
  firstLevelCategory: 1,
  secondCategory: 'Development',
  alias: 'javascript',
  title: 'Javascript Course',
  category: 'javascript',
  hh: {
    count: 1000,
    juniorSalary: 120000,
    middleSalary: 220000,
    seniorSalary: 350000,
  },
  advantages: [
    {
      title: 'Скорость разработки',
      description: 'Мое описание',
    },
  ],
  seoText: 'тест',
  tagsTitle: 'Полученные знания',
  tags: ['Javascript'],
};

const updateTopPageDto: Partial<CreateTopPageDto> = {
  title: 'Test',
};

const findTopPageDto: FindTopPageDto = {
  firstCategory: createTopPageDto.firstLevelCategory,
};

describe('TopPageController /top-page (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let authService: AuthService;
  let pageId: string;

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

  it('/create (POST)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/top-page/create/')
      .send(createTopPageDto)
      .set('Authorization', `Bearer ${token}`);

    pageId = body._id;

    expect(statusCode).toBe(HttpStatus.CREATED);
    expect(body._id).toBeTruthy();
    expect(body.title).toBe(createTopPageDto.title);
  });

  it('/create (POST) - failed, unauthorized', async () => {
    const { statusCode } = await request(app.getHttpServer())
      .post('/top-page/create/')
      .send(createTopPageDto);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/create (POST) - failed, uncorrect format data', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post('/top-page/create/')
      .send({ ...createTopPageDto, title: undefined, alias: undefined })
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message.length).toBeGreaterThanOrEqual(1);
  });

  it('/:id (GET)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .get(`/top-page/${pageId}/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body._id).toBe(pageId);
    expect(body.alias).toBe(createTopPageDto.alias);
  });

  it('/:id (GET) - failed, unauthorized', async () => {
    const { statusCode } = await request(app.getHttpServer()).get(
      `/top-page/${pageId}/`,
    );

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/:id (GET) - failed, uncorrect format id', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .get(`/top-page/${pageId}1/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message).toBe(ID_VALIDATION_ERROR);
  });

  it('/:id (GET) - failed, id not found', async () => {
    const id = new Types.ObjectId().toHexString();
    const { statusCode, body } = await request(app.getHttpServer())
      .get(`/top-page/${id}/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body.message).toBe(TOP_PAGE_NOT_FOUND);
  });

  it('/:id (PATCH)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .patch(`/top-page/${pageId}/`)
      .send(updateTopPageDto)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.title).toBe(updateTopPageDto.title);
  });

  it('/:id (PATCH) - failed, unauthorized', async () => {
    const { statusCode } = await request(app.getHttpServer())
      .patch(`/top-page/${pageId}/`)
      .send(updateTopPageDto);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/:id (PATCH) - failed, uncorrect format id', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .patch(`/top-page/${pageId}1/`)
      .send(updateTopPageDto)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message).toBe(ID_VALIDATION_ERROR);
  });

  it('/:id (PATCH) - failed, id not found', async () => {
    const id = new Types.ObjectId().toHexString();
    const { statusCode, body } = await request(app.getHttpServer())
      .patch(`/top-page/${id}/`)
      .send(updateTopPageDto)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body.message).toBe(TOP_PAGE_NOT_FOUND);
  });

  it('/find (POST)', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post(`/top-page/find/`)
      .send(findTopPageDto);

    //@ts-ignore
    const page = body.find((p) => p._id == pageId);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(page).toBeDefined();
    expect(page.alias).toBe(createTopPageDto.alias);
  });

  it('/find (POST) - failed, unvalid body', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .post(`/top-page/find/`)
      .send({ firstCategory: undefined });

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message.length).toBeGreaterThanOrEqual(1);
  });

  it('/byAlias/:alias (GET)', async () => {
    const { statusCode, body } = await request(app.getHttpServer()).get(
      `/top-page/byAlias/${createTopPageDto.alias}/`,
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body).toBeDefined();
    expect(body._id).toBe(pageId);
  });

  it('/byAlias/:alias (POST) - failed, not found', async () => {
    const { statusCode, body } = await request(app.getHttpServer()).get(
      `/top-page/byAlias/123/`,
    );

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body.message).toBe(TOP_PAGE_NOT_FOUND);
  });

  it('/textSearch/:text (GET)', async () => {
    const { statusCode, body } = await request(app.getHttpServer()).get(
      `/top-page/textSearch/${createTopPageDto.alias}/`,
    );

    //@ts-ignore
    const page = body.find((p) => p._id === pageId);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(page.alias).toBe(createTopPageDto.alias);
  });

  it('/textSearch/:text (GET) - success, empty result', async () => {
    const { statusCode, body } = await request(app.getHttpServer()).get(
      `/top-page/textSearch/asdasdasdasdasdasd/`,
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(0);
  });

  it('/:id (DELETE)', async () => {
    const { statusCode } = await request(app.getHttpServer())
      .delete(`/top-page/${pageId}/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.OK);
  });

  it('/:id (DELETE) - failed, unauthorized', async () => {
    const { statusCode } = await request(app.getHttpServer()).delete(
      `/top-page/${pageId}/`,
    );

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('/:id (DELETE) - failed, uncorrect format id', async () => {
    const { statusCode, body } = await request(app.getHttpServer())
      .delete(`/top-page/${pageId}1/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(body.message).toBe(ID_VALIDATION_ERROR);
  });

  it('/:id (DELETE) - failed, id not found', async () => {
    const id = new Types.ObjectId().toHexString();
    const { statusCode, body } = await request(app.getHttpServer())
      .delete(`/top-page/${id}/`)
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body.message).toBe(TOP_PAGE_NOT_FOUND);
  });

  afterAll(async () => {
    await authService.removeUser(authDto.login);
    await disconnect();
    await app.close();
  });
});
