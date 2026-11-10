import 'reflect-metadata';
import { databaseConfig } from '@app/config';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './data-source-options';

export const dataSource = new DataSource({
  ...dataSourceOptions(databaseConfig()),
  migrations: ['libs/database/src/migrations/*.ts'],
});
