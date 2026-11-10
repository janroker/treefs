import { databaseConfig, testEnv } from '@app/config';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../data-source-options';
import { truncateAll } from './db';

export async function setup(): Promise<void> {
  Object.assign(process.env, testEnv);
  const dataSource = new DataSource({
    ...dataSourceOptions(databaseConfig()),
    migrations: ['libs/database/src/migrations/*.ts'],
  });
  await dataSource.initialize();
  try {
    await dataSource.runMigrations({ transaction: 'each' });
    await truncateAll(dataSource);
  } finally {
    await dataSource.destroy();
  }
}
