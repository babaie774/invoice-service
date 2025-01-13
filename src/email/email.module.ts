import { Module } from '@nestjs/common';
import { RabbitModule } from '@src/rabbitmq/rabbitmq.module';
import { emailTransporterProvider } from './email.provider';
import { EmailService } from './email.service';

@Module({
  imports: [RabbitModule],
  providers: [EmailService, emailTransporterProvider],
})
export class EmailModule {}
