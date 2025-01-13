import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { InvoicesModule } from '../invoices/invoices.module';
import { RabbitMQSharedModule } from '../rabbitmq/rabbitmq.module';
import { ReportService } from './report.service';

@Module({
  imports: [ScheduleModule.forRoot(), InvoicesModule, RabbitMQSharedModule],
  providers: [ReportService],
})
export class ReportModule {}
