import { registerAs, type ConfigType } from '@nestjs/config';
import { z } from 'zod';
import { parseEnv } from './parse-env';

const databaseEnvSchema = z.object({
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().min(1).max(65_535),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string().min(1),
  DB_POOL_SIZE: z.coerce.number().int().min(1).max(100),
  DB_POOL_WAIT_MS: z.coerce.number().int().min(100),
  STATEMENT_TIMEOUT_MS: z.coerce.number().int().min(100),
});

export const databaseConfig = registerAs('database', () => {
  const env = parseEnv(databaseEnvSchema);
  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    poolSize: env.DB_POOL_SIZE,
    poolWaitMs: env.DB_POOL_WAIT_MS,
    statementTimeoutMs: env.STATEMENT_TIMEOUT_MS,
  };
});

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
