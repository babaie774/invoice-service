import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    RabbitMQModule, // Use shared RabbitMQ module
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService], // Export InvoicesService
})
export class InvoicesModule {}
