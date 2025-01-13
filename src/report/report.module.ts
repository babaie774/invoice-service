import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InvoicesModule } from '@src/invoices/invoices.module';
import { ReportService } from './report.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE', // Match the injection token in ReportService
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // RabbitMQ URL
          queue: 'daily_sales_report_queue', // Define the queue name
          queueOptions: {
            durable: true, // Ensure the queue is durable
          },
        },
      },
    ]),
    InvoicesModule,
  ],
  providers: [ReportService], // Provide ReportService and dependencies
})
export class ReportModule {}
