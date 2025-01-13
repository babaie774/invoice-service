import { Module } from '@nestjs/common';
import { RabbitMQSharedModule } from '../rabbitmq/rabbitmq.module';
import { emailTransporterProvider } from './email.provider';
import { EmailService } from './email.service';

@Module({
  imports: [RabbitMQSharedModule],
  providers: [EmailService, emailTransporterProvider],
})
export class EmailModule {}
