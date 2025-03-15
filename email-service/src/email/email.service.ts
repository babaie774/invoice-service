import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async onModuleInit() {
    await this.consumeReports();
  }

  private async consumeReports() {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
      const queue = 'daily_sales_report';

      await channel.assertQueue(queue, { durable: true });
      console.log('Waiting for reports...');

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const report = JSON.parse(msg.content.toString());
          await this.sendDailyReport(report);
          channel.ack(msg);
        }
      });
    } catch (error) {
      console.error('Error consuming reports:', error);
      throw error;
    }
  }

  private async sendDailyReport(report: any) {
    const date = new Date(report.date).toLocaleDateString();
    const itemSummary = Object.entries(report.itemSummary)
      .map(([sku, quantity]) => `${sku}: ${quantity}`)
      .join('\n');

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'admin@example.com', // Configure recipient email
      subject: `Daily Sales Report - ${date}`,
      text: `
Daily Sales Report for ${date}

Total Sales: $${report.totalSales.toFixed(2)}

Item Summary:
${itemSummary}
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Daily report sent for ${date}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
} 