import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppRepositoryTag } from './app.repository';
import { AppRepositoryRedis } from './app.repository.redis';
import { AppPublisherTag } from './app.publisher';
import { AppRabbitPublisher } from './app.publisher.rabbit';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: AppRepositoryTag, useClass: AppRepositoryRedis },
    { provide: AppPublisherTag, useClass: AppRabbitPublisher },
  ],
})
export class AppModule {}
