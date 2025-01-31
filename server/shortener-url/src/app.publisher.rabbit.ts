import { Connection, Publisher } from 'rabbitmq-client';
import { AppPublisher } from './app.publisher';

export class AppRabbitPublisher implements AppPublisher {
  private rabbit: Connection;
  private publisher: Publisher;
  private readonly queue: string;
  private readonly localhost: string;

  constructor() {
    const rabbitmqUrl =
      process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
    this.queue = process.env.RABBITMQ_QUEUE || 'shortenedURL';

    this.rabbit = new Connection(rabbitmqUrl);
    this.rabbit.on('error', (err) => {
      console.log('RabbitMQ connection error', err);
    });
    this.rabbit.on('connection', () => {
      console.log('Connection successfully (re)established');
    });

    this.publisher = this.rabbit.createPublisher({
      // Enable publish confirmations, similar to consumer acknowledgements
      confirm: true,
      // Enable retries
      maxAttempts: 3,

      queues: [{ queue: this.queue, durable: true }],
    });

    this.localhost = process.env.LOCALHOST || 'http://localhost:3000';
  }

  async send(hash: string) {
    const url = `${this.localhost}/${hash}`;
    const data = { shortenedURL: url };

    const ch = await this.rabbit.acquire();

    // Publish directly to a queue
    await this.publisher.send(this.queue, data);

    const msg = ch.basicGet(this.queue);
    msg
      .then(() => console.log('Message was delivered'))
      .catch(
        () => console.log('Error trying to send message', data),
        // TODO: store message to retry
      );
    await ch.close();
  }
}

// Clean up when you receive a shutdown signal
async function onShutdown() {
  // Waits for pending confirmations and closes the publisher
  await this.publisher.close();
  await this.rabbit.close();
}
process.on('SIGINT', onShutdown);
