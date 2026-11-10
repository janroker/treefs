import { registerAs, type ConfigType } from '@nestjs/config';
import { z } from 'zod';
import { parseEnv } from './parse-env';

const appEnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65_535),
  API_PREFIX: z.string().regex(/^[a-z][a-z0-9-]*$/),
});

export const appConfig = registerAs('app', () => {
  const env = parseEnv(appEnvSchema);
  return { port: env.PORT, apiPrefix: env.API_PREFIX };
});

export type AppConfig = ConfigType<typeof appConfig>;
