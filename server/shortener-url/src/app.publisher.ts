export interface AppPublisher {
  send(hash: string);
}

export const AppPublisherTag = 'AppPublisher';
