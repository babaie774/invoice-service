import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from '../invoices/invoices.service';
import { RabbitMQPublisher } from '../rabbitmq/rabbitmq.publisher';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;
  let invoicesService: InvoicesService;
  let rabbitMQPublisher: RabbitMQPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
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
        Logger,
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    invoicesService = module.get<InvoicesService>(InvoicesService);
    rabbitMQPublisher = module.get<RabbitMQPublisher>(RabbitMQPublisher);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate and publish daily summary', async () => {
    const mockInvoices = [
      {
        amount: 100,
        items: [
          { sku: 'item1', qt: 2 },
          { sku: 'item2', qt: 3 },
        ],
      },
      {
        amount: 200,
        items: [
          { sku: 'item1', qt: 1 },
          { sku: 'item3', qt: 4 },
        ],
      },
    ];

    invoicesService.getAllInvoices = jest.fn().mockResolvedValue(mockInvoices);

    await service.generateDailySummary();

    expect(invoicesService.getAllInvoices).toHaveBeenCalled();
    expect(rabbitMQPublisher.publish).toHaveBeenCalledWith(
      'daily_sales_report',
      {
        totalSales: 300,
        skuSummary: {
          item1: 3,
          item2: 3,
          item3: 4,
        },
      },
    );
  });
});
