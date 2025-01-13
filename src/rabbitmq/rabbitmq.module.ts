import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure ConfigModule is imported
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        exchanges: [
          {
            name: configService.get<string>('RABBITMQ_EXCHANGE'),
            type: configService.get<string>('RABBITMQ_EXCHANGE_TYPE'),
          },
        ],
        uri: configService.get<string>('RABBITMQ_URL'),
        channels: {
          'channel-1': {
            prefetchCount: 15,
            default: true,
          },
          'channel-2': {
            prefetchCount: 2,
          },
        },
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitModule {}
