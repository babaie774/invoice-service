import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as amqp from 'amqplib';
import { InvoiceService } from '../invoice/invoice.service';

@Injectable()
export class ReportService {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async generateDailyReport() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const invoices = await this.invoiceService.findByDateRange(today, tomorrow);

    const totalSales = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const itemSummary = this.calculateItemSummary(invoices);

    const report = {
      date: today,
      totalSales,
      itemSummary,
    };

    await this.publishReport(report);
  }

  private calculateItemSummary(invoices: any[]) {
    const summary = {};
    invoices.forEach((invoice) => {
      invoice.items.forEach((item) => {
        if (!summary[item.sku]) {
          summary[item.sku] = 0;
        }
        summary[item.sku] += item.qt;
      });
    });
    return summary;
  }

  private async publishReport(report: any) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
      const queue = 'daily_sales_report';

      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(report)), {
        persistent: true,
      });

      await channel.close();
      await connection.close();
    } catch (error) {
      console.error('Error publishing report:', error);
      throw error;
    }
  }
} 