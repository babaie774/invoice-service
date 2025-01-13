// src/invoices/invoices.module.ts
import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'daily_sales_report', // Exchange name
          type: 'direct', // Exchange type
        },
      ],
      uri: 'amqp://localhost:5672', // Replace with your RabbitMQ URI
    }),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService, RabbitMQModule], // Export both InvoicesService and RabbitMQModule
})
export class InvoicesModule {}
