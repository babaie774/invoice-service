import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InvoicesService } from 'src/invoices/invoices.service';
import { RabbitMQPublisher } from 'src/rabbitmq/rabbitmq.publisher';

@Injectable()
export class DailySummaryService {
  private readonly logger = new Logger(DailySummaryService.name);

  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly rabbitMQPublisher: RabbitMQPublisher,
  ) {}

  @Cron('0 12 * * *') // Runs every day at 12:00 PM
  async generateDailySummary() {
    this.logger.log('Generating daily sales summary...');

    // Get today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const invoices = await this.invoicesService.getAllInvoices(
      today.toISOString(),
      tomorrow.toISOString(),
    );

    // Calculate total sales and quantities
    const summary = invoices.reduce(
      (acc, invoice) => {
        acc.totalSales += invoice.amount;
        invoice.items.forEach((item) => {
          if (!acc.skuSummary[item.sku]) {
            acc.skuSummary[item.sku] = 0;
          }
          acc.skuSummary[item.sku] += item.qt;
        });
        return acc;
      },
      { totalSales: 0, skuSummary: {} },
    );

    // Publish summary to RabbitMQ
    await this.rabbitMQPublisher.publish('daily_sales_report', summary);

    this.logger.log('Daily sales summary generated and published.');
  }
}
