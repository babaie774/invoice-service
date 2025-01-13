import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule'; // Import ScheduleModule
import { InvoicesModule } from '@src/invoices/invoices.module';
import { Invoice, InvoiceSchema } from '../invoices/schemas/invoice.schema';
import { ReportService } from './report.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    ScheduleModule.forRoot(), // Initialize the scheduler
    InvoicesModule,
  ],
  providers: [ReportService],
})
export class ReportModule {}
