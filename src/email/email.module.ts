import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { emailTransporterProvider } from './email.provider';
import { EmailService } from './email.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // RabbitMQ URL
          queue: 'daily_sales_queue',
          queueOptions: {
            durable: true, // Ensure queue persistence
          },
        },
      },
    ]),
  ],
  providers: [EmailService, emailTransporterProvider],
})
export class EmailModule {}
