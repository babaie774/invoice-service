import { Module } from '@nestjs/common';
import { InvoiceModule } from '../invoice/invoice.module';
import { ReportService } from './report.service';

@Module({
  imports: [InvoiceModule],
  providers: [ReportService],
})
export class ReportModule {} 