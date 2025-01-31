import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppRepository, AppRepositoryTag } from './app.repository';
import { AppPublisher, AppPublisherTag } from './app.publisher';

@Injectable()
export class AppService {
  constructor(
    @Inject(AppRepositoryTag) private readonly appRepository: AppRepository,
    @Inject(AppPublisherTag) private readonly appPublisher: AppPublisher,
  ) {}

  ping(): string {
    return 'Hello World!';
  }

  async shorten(url: string): Promise<Observable<string>> {
    const max_length_hash = 10;
    const hash = generateRandomString(max_length_hash);
    await this.appPublisher.send(hash);
    return this.appRepository.put(hash, url);
  }

  retrieve(hash: string): Observable<string> {
    return this.appRepository.get(hash);
  }
}

function generateRandomString(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }
  return result;
}
