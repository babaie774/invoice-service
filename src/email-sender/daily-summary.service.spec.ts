import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from 'src/invoices/invoices.service';
import { RabbitMQPublisher } from 'src/rabbitmq/rabbitmq.publisher';
import { DailySummaryService } from './daily-summary.service';

describe('DailySummaryService', () => {
  let service: DailySummaryService;
  let invoicesService: InvoicesService;
  let rabbitMQPublisher: RabbitMQPublisher;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailySummaryService,
        {
          provide: InvoicesService,
          useValue: {
            getAllInvoices: jest.fn(),
          },
        },
        {
          provide: RabbitMQPublisher,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DailySummaryService>(DailySummaryService);
    invoicesService = module.get<InvoicesService>(InvoicesService);
    rabbitMQPublisher = module.get<RabbitMQPublisher>(RabbitMQPublisher);

    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateDailySummary', () => {
    it('should log that it is generating the sales summary', async () => {
      const mockInvoices = [
        {
          _id: '1',
          customer: 'John Doe',
          reference: 'INV001',
          date: new Date().toISOString(),
          amount: 100,
          items: [
            { sku: 'ITEM001', qt: 2 },
            { sku: 'ITEM002', qt: 3 },
          ],
          toJSON: jest.fn().mockReturnValue(this),
        } as any,
        {
          _id: '2',
          customer: 'Jane Smith',
          reference: 'INV002',
          date: new Date().toISOString(),
          amount: 200,
          items: [{ sku: 'ITEM001', qt: 1 }],
          toJSON: jest.fn().mockReturnValue(this),
        } as any,
      ];

      // Mock the InvoicesService response
      jest
        .spyOn(invoicesService, 'getAllInvoices')
        .mockResolvedValue(mockInvoices);

      // Call the method
      await service.generateDailySummary();

      // Verify logging
      expect(loggerSpy).toHaveBeenCalledWith(
        'Generating daily sales summary...',
      );
    });

    it('should calculate total sales and SKU summary correctly', async () => {
      const mockInvoices = [
        {
          _id: '1',
          customer: 'John Doe',
          reference: 'INV001',
          date: new Date().toISOString(),
          amount: 100,
          items: [
            { sku: 'ITEM001', qt: 2 },
            { sku: 'ITEM002', qt: 3 },
          ],
          toJSON: jest.fn().mockReturnValue(this),
        } as any,
        {
          _id: '2',
          customer: 'Jane Smith',
          reference: 'INV002',
          date: new Date().toISOString(),
          amount: 200,
          items: [{ sku: 'ITEM001', qt: 1 }],
          toJSON: jest.fn().mockReturnValue(this),
        } as any,
      ];

      // Mock the InvoicesService response
      jest
        .spyOn(invoicesService, 'getAllInvoices')
        .mockResolvedValue(mockInvoices);

      const publishSpy = jest.spyOn(rabbitMQPublisher, 'publish');

      // Call the method
      await service.generateDailySummary();

      // Verify the summary calculations
      const expectedSummary = {
        totalSales: 300,
        skuSummary: {
          ITEM001: 3,
          ITEM002: 3,
        },
      };

      expect(publishSpy).toHaveBeenCalledWith(
        'daily_sales_report',
        expectedSummary,
      );
    });

    it('should publish the summary to RabbitMQ', async () => {
      const mockInvoices = [
        {
          _id: '1',
          customer: 'John Doe',
          reference: 'INV001',
          date: new Date().toISOString(),
          amount: 100,
          items: [{ sku: 'ITEM001', qt: 2 }],
          toJSON: jest.fn().mockReturnValue(this),
        } as any,
      ];

      // Mock the InvoicesService response
      jest
        .spyOn(invoicesService, 'getAllInvoices')
        .mockResolvedValue(mockInvoices);

      const publishSpy = jest.spyOn(rabbitMQPublisher, 'publish');

      // Call the method
      await service.generateDailySummary();

      // Verify RabbitMQ publish was called
      expect(publishSpy).toHaveBeenCalledWith('daily_sales_report', {
        totalSales: 100,
        skuSummary: {
          ITEM001: 2,
        },
      });

      // Verify logging
      expect(loggerSpy).toHaveBeenCalledWith(
        'Daily sales summary generated and published.',
      );
    });
  });
});
