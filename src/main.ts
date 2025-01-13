import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  try {
    console.log('Connecting to RabbitMQ with URL:', process.env.RABBITMQ_URL);
    console.log('Queue Name:', process.env.RABBITMQ_QUEUE);
    console.log('Starting the HTTP server...');
    const app = await NestFactory.create(AppModule);

    console.log('Attempting to listen on port 3000...');
    await app.listen(3000);
    console.log('HTTP server is running on http://localhost:3000');

    console.log('Connecting to RabbitMQ...');
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: process.env.RABBITMQ_QUEUE || 'daily_sales_report',
        queueOptions: {
          durable: true,
        },
        socketOptions: {
          timeout: 10000, // Increase timeout to 10 seconds
        },
      },
    });

    await app.startAllMicroservices();
    console.log('Microservice connected to RabbitMQ');
  } catch (error) {
    console.error('Error during bootstrap:', error.message, error.stack);
  }
}

bootstrap();
