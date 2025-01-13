// src/report/report.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitMQService } from '@src/rabbitmq/rabbitmq.service';
import { InvoicesModule } from '../invoices/invoices.module';
import { RabbitModule } from '../rabbitmq/rabbitmq.module';
import { ReportService } from './report.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Enable cron jobs
    InvoicesModule, // Import for InvoicesService
    RabbitModule, // Import for RabbitMQService
  ],
  providers: [ReportService, RabbitMQService], // Provide ReportService
})
export class ReportModule {}
