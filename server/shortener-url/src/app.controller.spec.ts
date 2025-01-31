/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {of, tap} from 'rxjs';
import { AppRepositoryTag } from './app.repository';
import { AppRepositoryHashmap } from './app.repository.hashmap';
import {AppPublisherTag} from "./app.publisher";
import {AppMockPublisher} from "./app.publisher.mock";

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: AppRepositoryTag, useClass: AppRepositoryHashmap },
        { provide: AppPublisherTag, useClass: AppMockPublisher },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.ping()).toBe('Hello World!');
    });
  });

  describe('url', () => {
    it('should return true', (done) => {
      const url = 'aerabi.com';
      appController
        .shorten(url)
          .then((result) =>
              of({
                success: result,
              }).pipe(tap((result) => expect(result).toBeTruthy())).subscribe({ complete: done }),
          )
    });
  });
});