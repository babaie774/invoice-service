import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly queueName =
    process.env.RABBITMQ_QUEUE || 'daily_sales_report';
  private readonly rabbitMQUrl =
    process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      this.connection = await amqp.connect(this.rabbitMQUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });

      // Handle connection close
      this.connection.on('close', async () => {
        console.error('RabbitMQ connection closed. Attempting to reconnect...');
        await this.reconnect();
      });

      // Handle connection errors
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
      });

      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      // Implement reconnection logic or throw an error based on your application's needs
    }
  }

  private async disconnect() {
    try {
      await this.channel.close();
      await this.connection.close();
      console.log('Disconnected from RabbitMQ');
    } catch (error) {
      console.error('Error during RabbitMQ disconnection:', error);
    }
  }

  private async reconnect() {
    // Implement a delay or backoff strategy before attempting to reconnect
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await this.connect();
  }

  async publish(message: any, queueName?: any) {
    try {
      const targetQueue = queueName || this.queueName; // Use provided queueName or fallback
      if (!this.channel) {
        console.error('Channel is not available. Reconnecting...');
        await this.connect();
      }
      this.channel.sendToQueue(
        targetQueue,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
        },
      );
      console.log('Message published to queue:', targetQueue);
    } catch (error) {
      console.error('Failed to publish message:', error);
      // Optionally implement retry logic here
    }
  }
}
