import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../models/invoice.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  async create(createInvoiceDto: any): Promise<Invoice> {
    const createdInvoice = new this.invoiceModel(createInvoiceDto);
    return createdInvoice.save();
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async findOne(id: string): Promise<Invoice> {
    return this.invoiceModel.findById(id).exec();
  }
}
