import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async createInvoice(data: any): Promise<Invoice> {
    const newInvoice = new this.invoiceModel(data);
    return newInvoice.save();
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    return this.invoiceModel.findById(id).exec();
  }

  async getAllInvoices(
    startDate?: string,
    endDate?: string,
  ): Promise<Invoice[]> {
    const query: any = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    return this.invoiceModel.find(query).exec();
  }
}
