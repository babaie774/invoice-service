import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { InvoicesService } from './invoices.service';

describe('InvoicesController (e2e)', () => {
  let app: INestApplication;
  let invoicesService: InvoicesService;

  const mockInvoice = {
    customer: 'John Doe',
    amount: 150,
    reference: 'INV-001',
    items: [
      { sku: 'ITEM001', qt: 2 },
      { sku: 'ITEM002', qt: 3 },
    ],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    invoicesService = moduleFixture.get<InvoicesService>(InvoicesService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /invoices - should create a new invoice', () => {
    return request(app.getHttpServer())
      .post('/invoices')
      .send(mockInvoice)
      .expect(201)
      .then((response) => {
        expect(response.body.customer).toEqual('John Doe');
        expect(response.body.amount).toEqual(150);
      });
  });

  it('GET /invoices/:id - should retrieve an invoice by ID', () => {
    jest
      .spyOn(invoicesService, 'getInvoiceById')
      .mockResolvedValueOnce(mockInvoice as any);

    return request(app.getHttpServer())
      .get('/invoices/123')
      .expect(200)
      .then((response) => {
        expect(response.body.customer).toEqual('John Doe');
        expect(response.body.amount).toEqual(150);
      });
  });

  it('GET /invoices - should retrieve all invoices', () => {
    jest
      .spyOn(invoicesService, 'getAllInvoices')
      .mockResolvedValueOnce([mockInvoice] as any);

    return request(app.getHttpServer())
      .get('/invoices')
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(1);
        expect(response.body[0].customer).toEqual('John Doe');
      });
  });
});
