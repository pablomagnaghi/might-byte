import { AppPublisher } from './app.publisher';

export class AppMockPublisher implements AppPublisher {
  async send(message: string) {
    console.log('Mocking message % sent', message);
  }
}
