import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const createdInvoice = new this.invoiceModel(createInvoiceDto);
    return createdInvoice.save();
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async findOne(id: string): Promise<Invoice> {
    return this.invoiceModel.findById(id).exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]> {
    return this.invoiceModel
      .find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();
  }
} 