import { NestFactory } from '@nestjs/core';
import { WebModule } from './web.module';

async function bootstrap() {
  const app = await NestFactory.create(WebModule);
  await app.listen(process.env.port ?? 3000);
}
await bootstrap();
