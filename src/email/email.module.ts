import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@src/rabbitmq/rabbitmq.module';
import { emailTransporterProvider } from './email.provider';
import { EmailService } from './email.service';

@Module({
  imports: [RabbitMQModule],
  providers: [EmailService, emailTransporterProvider],
})
export class EmailModule {}
