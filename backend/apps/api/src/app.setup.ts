import { appConfig, type AppConfig } from '@app/config';
import type { INestApplication } from '@nestjs/common';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix(app.get<AppConfig>(appConfig.KEY).apiPrefix);
}
