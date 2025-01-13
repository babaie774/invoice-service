// src/rabbitmq/rabbitmq.module.ts
import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'daily_sales_report',
          type: 'direct',
        },
      ],
      uri: 'amqp://localhost:5672',
    }),
  ],
  exports: [RabbitMQModule], // Export for other modules
})
export class RabbitMQSharedModule {}
