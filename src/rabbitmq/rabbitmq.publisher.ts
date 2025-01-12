import { Injectable } from '@nestjs/common';
import { connect } from 'amqplib';

@Injectable()
export class RabbitMQPublisher {
  private readonly queueName = 'daily_sales_report';

  async publish(queue: string, message: any) {
    const connection = await connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    await channel.close();
    await connection.close();
  }
}
