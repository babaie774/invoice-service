import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly invoicesService: InvoicesService,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  @Cron('0 12 * * *', {
    timeZone: process.env.CRON_TIMEZONE || 'UTC',
  })
  async generateDailySummary() {
    this.logger.log('Generating daily sales summary...');

    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setUTCDate(today.getUTCDate() + 1);

      const invoices = await this.invoicesService.getAllInvoices(
        today.toISOString(),
        tomorrow.toISOString(),
      );

      if (!invoices || invoices.length === 0) {
        this.logger.warn('No invoices found for the current day.');
        return;
      }

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

      this.rabbitClient.emit('daily-sales-summary', summary);
      this.logger.log(
        'Daily sales summary generated and published successfully.',
      );
    } catch (error) {
      this.logger.error('Error generating daily sales summary', error.stack);
    }
  }
}
