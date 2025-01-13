import { Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let transporterMock: jest.Mocked<nodemailer.Transporter>;
  let rabbitClientMock: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    // Mock nodemailer transporter
    transporterMock = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
    } as unknown as jest.Mocked<nodemailer.Transporter>;

    // Mock RabbitMQ client
    rabbitClientMock = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<ClientProxy>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: 'EMAIL_TRANSPORTER',
          useValue: transporterMock,
        },
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: rabbitClientMock,
        },
        Logger,
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should handle sales report and send an email', async () => {
    const mockReport = {
      totalSales: 500,
      skuSummary: {
        A1: 10,
        B2: 20,
      },
    };

    const recipient = 'test-recipient@example.com';
    process.env.RECIPIENT_EMAIL = recipient;

    // Spy on sendMail to verify it is called
    const spySendMail = jest.spyOn(transporterMock, 'sendMail');

    await service.handleSalesReport(mockReport);

    // Verify transporter.sendMail is called with the correct parameters
    expect(spySendMail).toHaveBeenCalledWith({
      from: '"Daily Sales Report" <no-reply@example.com>',
      to: recipient,
      subject: 'Daily Sales Report',
      text: expect.any(String),
      html: expect.any(String),
    });
  });

  //   it('should log an error if email sending fails', async () => {
  //     const mockReport = {
  //       totalSales: 300,
  //       skuSummary: {
  //         C1: 15,
  //         D2: 25,
  //       },
  //     };

  //     // Simulate an error in sendMail
  //     transporterMock.sendMail.mockRejectedValueOnce(new Error('Email failed'));

  //     const loggerSpy = jest.spyOn(service['logger'], 'error');

  //     await expect(
  //       service.handleSalesReport(mockReport),
  //     ).resolves.toBeUndefined();

  //     // Ensure error is logged
  //     expect(loggerSpy).toHaveBeenCalledWith(
  //       'Failed to process sales report or send email:',
  //       'Email failed',
  //     );
  //   });
});
