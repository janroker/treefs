import { RuntimeExceptionFilter } from '@app/common/errors';
import { DatabaseModule } from '@app/database/database.module';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigModule } from './config/api-config.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [ApiConfigModule, DatabaseModule, ItemsModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: RuntimeExceptionFilter },
  ],
})
export class AppModule {}
