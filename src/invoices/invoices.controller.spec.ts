import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './schemas/invoice.schema';

const result: Invoice = {
  id: '1',
  _id: 'mocked_id',
  customer: 'John Doe',
  amount: 100,
  reference: 'REF123',
  date: new Date('2025-01-01'),
  items: [],
} as Invoice; // Explicitly cast as Invoice

const id = '1';

describe('InvoicesController', () => {
  let invoicesController: InvoicesController;
  let invoicesService: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: {
            createInvoice: jest.fn(),
            getInvoiceById: jest.fn(),
            getAllInvoices: jest.fn(),
          },
        },
      ],
    }).compile();

    invoicesController = module.get<InvoicesController>(InvoicesController);
    invoicesService = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(invoicesController).toBeDefined();
  });

  describe('createInvoice', () => {
    it('should call InvoicesService.createInvoice with the correct data', async () => {
      jest.spyOn(invoicesService, 'createInvoice').mockResolvedValue(result);

      expect(await invoicesController.createInvoice(result)).toEqual(result);
      expect(invoicesService.createInvoice).toHaveBeenCalledWith(result);
    });
  });

  describe('getInvoiceById', () => {
    it('should call InvoicesService.getInvoiceById with the correct id', async () => {
      jest.spyOn(invoicesService, 'getInvoiceById').mockResolvedValue(result);

      expect(await invoicesController.getInvoiceById(id)).toEqual(result);
      expect(invoicesService.getInvoiceById).toHaveBeenCalledWith(id);
    });
  });

  describe('getAllInvoices', () => {
    it('should call InvoicesService.getAllInvoices with the correct query params', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';

      jest.spyOn(invoicesService, 'getAllInvoices').mockResolvedValue([result]);

      expect(
        await invoicesController.getAllInvoices(startDate, endDate),
      ).toEqual([result]);
      expect(invoicesService.getAllInvoices).toHaveBeenCalledWith(
        startDate,
        endDate,
      );
    });

    it('should call InvoicesService.getAllInvoices without query params if none provided', async () => {
      jest.spyOn(invoicesService, 'getAllInvoices').mockResolvedValue([result]);

      expect(await invoicesController.getAllInvoices()).toEqual([result]);
      expect(invoicesService.getAllInvoices).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
    });
  });
});
