import type { DatabaseConfig } from '@app/config';
import type { DataSourceOptions } from 'typeorm';
import { Item } from './entities/item/item.entity';

export function dataSourceOptions(config: DatabaseConfig): DataSourceOptions {
  return {
    type: 'postgres',
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    synchronize: false,
    migrationsRun: false,
    entities: [Item],
    extra: {
      max: config.poolSize,
      connectionTimeoutMillis: config.poolWaitMs,
      statement_timeout: config.statementTimeoutMs,
    },
  };
}
