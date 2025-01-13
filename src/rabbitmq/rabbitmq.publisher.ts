import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitMQPublisher {
  private readonly exchangeName = 'daily_sales_report';

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publish(summary: any): Promise<void> {
    await this.amqpConnection.publish(
      this.exchangeName,
      '', // Routing key
      summary, // Message payload
    );
  }
}
