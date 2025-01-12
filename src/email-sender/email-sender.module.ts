import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule'; // Import ScheduleModule
import { InvoicesController } from 'src/invoices/invoices.controller';
import { InvoicesService } from 'src/invoices/invoices.service';
import { Invoice, InvoiceSchema } from 'src/invoices/schemas/invoice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    ScheduleModule.forRoot(), // Initialize the scheduler
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
