import { appConfig } from '@app/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const apiConfigs = [appConfig];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/api/.env',
      load: apiConfigs,
    }),
  ],
})
export class ApiConfigModule {}
