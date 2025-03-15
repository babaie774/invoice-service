import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  const mockInvoice = {
    customer: 'John Doe',
    amount: 100,
    reference: 'INV001',
    date: new Date(),
    items: [{ sku: 'SKU001', qt: 2 }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockInvoice),
            findAll: jest.fn().mockResolvedValue([mockInvoice]),
            findOne: jest.fn().mockResolvedValue(mockInvoice),
            findByDateRange: jest.fn().mockResolvedValue([mockInvoice]),
          },
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new invoice', async () => {
      const result = await controller.create(mockInvoice);

      expect(service.create).toHaveBeenCalledWith(mockInvoice);
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockInvoice]);
    });
  });

  describe('findOne', () => {
    it('should return a single invoice', async () => {
      const result = await controller.findOne('a-valid-id');

      expect(service.findOne).toHaveBeenCalledWith('a-valid-id');
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('findByDateRange', () => {
    it('should return invoices within date range', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-02';

      const result = await controller.findByDateRange(startDate, endDate);

      expect(service.findByDateRange).toHaveBeenCalledWith(
        new Date(startDate),
        new Date(endDate),
      );
      expect(result).toEqual([mockInvoice]);
    });
  });
}); 