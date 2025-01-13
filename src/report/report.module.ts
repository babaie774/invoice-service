// src/report/report.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitMQModule } from '@src/rabbitmq/rabbitmq.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { ReportService } from './report.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Enable cron jobs
    InvoicesModule, // Import for InvoicesService
    RabbitMQModule, // Import for RabbitMQService
  ],
  providers: [ReportService], // Provide ReportService
})
export class ReportModule {}
