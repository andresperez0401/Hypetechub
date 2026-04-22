import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { VideosModule } from '../videos.module';

describe('VideosController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), VideosModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/videos returns list and featured', async () => {
    const response = await request(app.getHttpServer()).get('/api/videos').expect(200);

    expect(response.body.items).toBeDefined();
    expect(response.body.featured).toBeDefined();
    expect(Array.isArray(response.body.items)).toBe(true);
  });
});
