import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { InvoicesModule } from './invoices/invoices.module';
import { RabbitModule } from './rabbitmq/rabbitmq.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/invoice_service'),
    InvoicesModule,
    ReportModule,
    EmailModule,
    RabbitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
