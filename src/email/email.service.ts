import { RabbitSubscribe } from '@nestjs-plus/rabbitmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject('EMAIL_TRANSPORTER')
    private readonly transporter: nodemailer.Transporter,
  ) {}

  @RabbitSubscribe({
    exchange: 'daily_sales_report',
    routingKey: '',
    queue: 'daily_sales_queue',
  })
  async handleSalesReport(report: any) {
    this.logger.log(`Received sales report: ${JSON.stringify(report)}`);

    try {
      const emailContent = this.createEmailContent(report);

      const recipient =
        process.env.RECIPIENT_EMAIL || 'default-recipient@example.com';
      await this.sendEmail(
        recipient,
        'Daily Sales Report',
        emailContent.text,
        emailContent.html,
      );

      this.logger.log(`Email sent successfully to ${recipient}`);
    } catch (error) {
      this.logger.error('Failed to process sales report or send email:', error);
    }
  }

  private createEmailContent(report: any) {
    const text = `
      Daily Sales Report
      ==================
      Total Sales: ${report.totalSales}

      Items Sold:
      ${Object.entries(report.skuSummary)
        .map(([sku, quantity]) => `SKU: ${sku}, Quantity: ${quantity}`)
        .join('\n')}`;

    const html = `
      <h1>Daily Sales Report</h1>
      <p><strong>Total Sales:</strong> ${report.totalSales}</p>
      <h2>Items Sold</h2>
      <ul>
        ${Object.entries(report.skuSummary)
          .map(
            ([sku, quantity]) =>
              `<li><strong>SKU:</strong> ${sku}, <strong>Quantity:</strong> ${quantity}</li>`,
          )
          .join('')}
      </ul>`;

    return { text, html };
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const mailOptions = {
      from: '"Daily Sales Report" <no-reply@example.com>',
      to,
      subject,
      text,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${to}: ${error.message}`);
      throw error;
    }
  }
}
