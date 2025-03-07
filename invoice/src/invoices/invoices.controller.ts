import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Invoice } from 'src/models/invoice.schema';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Post()
  async create(@Body() createInvoiceDto: any): Promise<Invoice> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  async findAll(): Promise<Invoice[]> {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Invoice> {
    return this.invoiceService.findOne(id);
  }
}
