import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from '../invoices/invoices.service';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;
  let invoicesService: InvoicesService;
  let rabbitClient: ClientProxy;

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
          provide: 'RABBITMQ_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    invoicesService = module.get<InvoicesService>(InvoicesService);
    rabbitClient = module.get<ClientProxy>('RABBITMQ_SERVICE');
  });

  it('should generate and publish daily sales summary', async () => {
    const mockInvoices = [
      {
        date: new Date(), // Use a Date object instead of a string
        amount: 100,
        items: [{ sku: 'A1', qt: 2 }],
      },
      {
        date: new Date(),
        amount: 200,
        items: [
          { sku: 'A1', qt: 3 },
          { sku: 'B1', qt: 1 },
        ],
      },
    ];

    jest
      .spyOn(invoicesService, 'getAllInvoices')
      .mockResolvedValue(mockInvoices);
    const emitSpy = jest.spyOn(rabbitClient, 'emit');

    await service.generateDailySummary();

    expect(invoicesService.getAllInvoices).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('daily-sales-summary', {
      totalSales: 300,
      skuSummary: { A1: 5, B1: 1 },
    });
  });
});
