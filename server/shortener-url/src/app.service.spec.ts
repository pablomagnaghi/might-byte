import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AppRepositoryTag } from './app.repository';
import { AppRepositoryHashmap } from './app.repository.hashmap';
import { tap } from 'rxjs';
import { AppPublisherTag } from './app.publisher';
import { AppMockPublisher } from './app.publisher.mock';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AppRepositoryTag, useClass: AppRepositoryHashmap },
        { provide: AppPublisherTag, useClass: AppMockPublisher },
        AppService,
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('retrieve', () => {
    it('should retrieve the saved URL', (done) => {
      const url = 'docker.com';
      appService
        .shorten(url)
        .then((result) =>
          result
            .pipe(
              tap((hash) =>
                appService
                  .retrieve(hash)
                  .pipe(tap((retrieved) => expect(retrieved).toEqual(url))),
              ),
            )
            .subscribe({ complete: done }),
        );
    });
  });
});
