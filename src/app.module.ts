import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesModule } from './invoices/invoices.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/invoice_service'),
    InvoicesModule,
    EmailModule,
  ],
})
export class AppModule {}
