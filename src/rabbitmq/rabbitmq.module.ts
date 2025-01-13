import { Module } from '@nestjs/common';
import { RabbitMQPublisher } from './rabbitmq.publisher';

@Module({
  providers: [RabbitMQPublisher],
  exports: [RabbitMQPublisher], // Export to make it available in other modules
})
export class RabbitMQModule {}
