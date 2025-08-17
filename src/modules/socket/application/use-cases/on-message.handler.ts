export class OnMessageHandler {
  handle(message: string, userId: string) {
    // business logic here
    return `Handled message "${message}" for user ${userId}`;
  }
}
