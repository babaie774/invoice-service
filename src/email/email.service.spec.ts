import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);

    // Mock the logger to avoid actual console output during testing
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should log that the service is listening for messages', () => {
      service.onModuleInit();
      expect(loggerSpy).toHaveBeenCalledWith(
        'Email Service is up and listening for messages...',
      );
    });
  });

  describe('handleSalesReport', () => {
    it('should log the received sales report and call sendEmail', async () => {
      const mockReport = { totalSales: 1000, skuSummary: { ITEM001: 10 } };

      // Spy on sendEmail to ensure it's called
      const sendEmailSpy = jest
        .spyOn(service as any, 'sendEmail')
        .mockResolvedValue(undefined); // Provide resolved value

      await service.handleSalesReport(mockReport);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Received sales report:',
        JSON.stringify(mockReport),
      );
      expect(sendEmailSpy).toHaveBeenCalledWith(mockReport);
    });
  });

  describe('sendEmail', () => {
    it('should log the email sending logic', async () => {
      const mockReport = { totalSales: 1000, skuSummary: { ITEM001: 10 } };

      await service['sendEmail'](mockReport);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Sending email with sales report: ${JSON.stringify(mockReport)}`,
      );
    });
  });
});
