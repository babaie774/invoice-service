import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RabbitMQService } from '@src/rabbitmq/rabbitmq.service';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  private readonly queueName =
    process.env.RABBITMQ_QUEUE || 'daily_sales_report';

  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Cron('0 12 * * *', {
    timeZone: process.env.CRON_TIMEZONE || 'UTC', // Configurable time zone
  })
  async generateDailySummary() {
    this.logger.log('Generating daily sales summary...');

    try {
      // Define the start and end of the current day in UTC
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setUTCDate(today.getUTCDate() + 1);

      // Fetch all invoices for the day
      const invoices = await this.invoicesService.getAllInvoices(
        today.toISOString(),
        tomorrow.toISOString(),
      );

      if (!invoices || invoices.length === 0) {
        this.logger.warn('No invoices found for the current day.');
        return;
      }

      // Summarize sales data
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
      await this.rabbitMQService.publish(this.queueName, summary);

      this.logger.log(
        'Daily sales summary generated and published successfully.',
      );
    } catch (error) {
      this.logger.error('Error generating daily sales summary', error.stack);

      // Optional: Retry logic or further error handling can be added here
    }
  }
}
