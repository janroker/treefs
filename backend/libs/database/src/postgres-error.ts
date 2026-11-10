import { QueryFailedError } from 'typeorm';
import type { DriverError } from './database.types';

export const sqlState = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  CHECK_VIOLATION: '23514',
  SERIALIZATION_FAILURE: '40001',
  DEADLOCK_DETECTED: '40P01',
  QUERY_CANCELED: '57014',
} as const;

export function sqlStateOf(error: unknown): string | undefined {
  if (!(error instanceof QueryFailedError)) {
    return undefined;
  }
  const { code } = error.driverError as DriverError;
  return typeof code === 'string' ? code : undefined;
}
