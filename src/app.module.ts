import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from './email/email.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/invoice_service'),
    InvoicesModule,
    EmailModule,
  ],
})
export class AppModule {}
