export class CreateInvoiceItemDto {
  sku: string;
  qt: number;
}

export class CreateInvoiceDto {
  customer: string;
  amount: number;
  reference: string;
  date: Date;
  items: CreateInvoiceItemDto[];
} 