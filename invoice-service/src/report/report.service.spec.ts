import { Test, TestingModule } from '@nestjs/testing';
import * as amqp from 'amqplib';
import { InvoiceService } from '../invoice/invoice.service';
import { ReportService } from './report.service';

jest.mock('amqplib', () => ({
  connect: jest.fn(),
}));

describe('ReportService', () => {
  let service: ReportService;
  let invoiceService: InvoiceService;

  const mockInvoices = [
    {
      customer: 'John Doe',
      amount: 100,
      reference: 'INV001',
      date: new Date(),
      items: [{ sku: 'SKU001', qt: 2 }],
    },
    {
      customer: 'Jane Doe',
      amount: 150,
      reference: 'INV002',
      date: new Date(),
      items: [{ sku: 'SKU001', qt: 1 }, { sku: 'SKU002', qt: 3 }],
    },
  ];

  const mockChannel = {
    assertQueue: jest.fn(),
    sendToQueue: jest.fn(),
    close: jest.fn(),
  };

  const mockConnection = {
    createChannel: jest.fn().mockResolvedValue(mockChannel),
    close: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: InvoiceService,
          useValue: {
            findByDateRange: jest.fn().mockResolvedValue(mockInvoices),
          },
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    invoiceService = module.get<InvoiceService>(InvoiceService);

    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateDailyReport', () => {
    it('should generate and publish daily report', async () => {
      await service.generateDailyReport();

      expect(invoiceService.findByDateRange).toHaveBeenCalled();
      expect(amqp.connect).toHaveBeenCalled();
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith('daily_sales_report', {
        durable: true,
      });
      expect(mockChannel.sendToQueue).toHaveBeenCalled();
      expect(mockChannel.close).toHaveBeenCalled();
      expect(mockConnection.close).toHaveBeenCalled();

      const sentReport = JSON.parse(
        mockChannel.sendToQueue.mock.calls[0][1].toString(),
      );
      expect(sentReport.totalSales).toBe(250);
      expect(sentReport.itemSummary).toEqual({
        SKU001: 3,
        SKU002: 3,
      });
    });

    it('should handle errors when publishing report', async () => {
      const error = new Error('Connection failed');
      (amqp.connect as jest.Mock).mockRejectedValue(error);

      await expect(service.generateDailyReport()).rejects.toThrow(error);
    });
  });
}); 