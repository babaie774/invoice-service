import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class InvoiceItem {
  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  qt: number;
}

@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [InvoiceItem], required: true })
  items: InvoiceItem[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
