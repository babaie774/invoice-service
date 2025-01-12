import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);

  onModuleInit() {
    this.logger.log('Email Service is up and listening for messages...');
  }

  @MessagePattern('daily_sales_report')
  async handleSalesReport(message: any) {
    this.logger.log('Received sales report:', JSON.stringify(message));

    // Process the sales report and send the email
    await this.sendEmail(message);
  }

  private async sendEmail(report: any): Promise<void> {
    // Mock email sending logic
    this.logger.log(
      `Sending email with sales report: ${JSON.stringify(report)}`,
    );
  }
}
