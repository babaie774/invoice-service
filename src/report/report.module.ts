// src/report/report.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { InvoicesModule } from '../invoices/invoices.module'; // Import InvoicesModule
import { ReportService } from './report.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Enable cron jobs
    InvoicesModule, // Import InvoicesModule to access InvoicesService and RabbitMQModule
  ],
  providers: [ReportService], // Include ReportService
})
export class ReportModule {}
