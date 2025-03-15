import { Test, TestingModule } from '@nestjs/testing';
import * as amqp from 'amqplib';
import * as nodemailer from 'nodemailer';
import { EmailService } from './email.service';

jest.mock('nodemailer');
jest.mock('amqplib', () => ({
  connect: jest.fn(),
}));

describe('EmailService', () => {
  let service: EmailService;

  const mockReport = {
    date: new Date('2024-01-01'),
    totalSales: 250,
    itemSummary: {
      SKU001: 3,
      SKU002: 3,
    },
  };

  const mockTransporter = {
    sendMail: jest.fn().mockResolvedValue(true),
  };

  const mockChannel = {
    assertQueue: jest.fn(),
    consume: jest.fn(),
    ack: jest.fn(),
  };

  const mockConnection = {
    createChannel: jest.fn().mockResolvedValue(mockChannel),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should setup RabbitMQ consumer', async () => {
      await service.onModuleInit();

      expect(amqp.connect).toHaveBeenCalled();
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith('daily_sales_report', {
        durable: true,
      });
      expect(mockChannel.consume).toHaveBeenCalled();
    });

    it('should handle messages and send emails', async () => {
      mockChannel.consume.mockImplementation((queue, callback) => {
        callback({
          content: Buffer.from(JSON.stringify(mockReport)),
        });
      });

      await service.onModuleInit();

      expect(mockTransporter.sendMail).toHaveBeenCalled();
      const emailOptions = mockTransporter.sendMail.mock.calls[0][0];
      expect(emailOptions.subject).toContain('2024-01-01');
      expect(emailOptions.text).toContain('250');
      expect(emailOptions.text).toContain('SKU001: 3');
      expect(emailOptions.text).toContain('SKU002: 3');
      expect(mockChannel.ack).toHaveBeenCalled();
    });

    it('should handle null messages', async () => {
      mockChannel.consume.mockImplementation((queue, callback) => {
        callback(null);
      });

      await service.onModuleInit();

      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
      expect(mockChannel.ack).not.toHaveBeenCalled();
    });

    it('should handle errors in message processing', async () => {
      const error = new Error('Failed to send email');
      mockTransporter.sendMail.mockRejectedValue(error);
      mockChannel.consume.mockImplementation((queue, callback) => {
        callback({
          content: Buffer.from(JSON.stringify(mockReport)),
        });
      });

      await expect(service.onModuleInit()).rejects.toThrow(error);
    });
  });
}); 