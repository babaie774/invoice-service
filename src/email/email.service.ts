import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect } from 'amqplib';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly queueName = 'daily_sales_report';
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com', // Replace with SMTP host
      port: 587, // Replace with SMTP port
      secure: false, // Set true if using SSL (port 465), otherwise false for TLS
      auth: {
        user: 'your-email@example.com', // Replace with email
        pass: 'your-password', // Replace with email password
      },
    });
  }

  async onModuleInit() {
    const connection = await connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    await channel.assertQueue(this.queueName, { durable: true });

    channel.consume(this.queueName, async (msg) => {
      if (msg !== null) {
        const report = JSON.parse(msg.content.toString());
        await this.processReport(report);
        channel.ack(msg);
      }
    });
  }

  private async processReport(report: any) {
    const emailContent = this.createEmailContent(report);

    try {
      await this.sendEmail(
        'recipient@example.com', // Replace with recipient's email
        'Daily Sales Report',
        emailContent.text,
        emailContent.html,
      );
      console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  }

  private createEmailContent(report: any) {
    const text = `
      Daily Sales Report
      ==================
      Total Sales: ${report.totalSales}

      Items Sold:
      ${report.itemSummary
        .map((item) => `SKU: ${item.sku}, Quantity: ${item.totalQuantity}`)
        .join('\n')}
    `;

    const html = `
      <h1>Daily Sales Report</h1>
      <p><strong>Total Sales:</strong> ${report.totalSales}</p>
      <h2>Items Sold</h2>
      <ul>
        ${report.itemSummary
          .map(
            (item) =>
              `<li><strong>SKU:</strong> ${item.sku}, <strong>Quantity:</strong> ${item.totalQuantity}</li>`,
          )
          .join('')}
      </ul>
    `;

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
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Error sending email: ${error.message}`);
      throw error;
    }
  }
}
