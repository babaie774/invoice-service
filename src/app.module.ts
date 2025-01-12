import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/invoice_service'),
    InvoicesModule,
  ],
})
export class AppModule {}
