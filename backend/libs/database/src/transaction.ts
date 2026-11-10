import { randomInt } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';
import type { DataSource, EntityManager } from 'typeorm';
import type { TransactionOptions } from './database.types';
import { sqlState, sqlStateOf } from './postgres-error';

const retryableStates = new Set<string>([
  sqlState.SERIALIZATION_FAILURE,
  sqlState.DEADLOCK_DETECTED,
]);

function isRetryable(error: unknown): boolean {
  const state = sqlStateOf(error);
  return state !== undefined && retryableStates.has(state);
}

function backoffMs(attempt: number): number {
  return 10 * 2 ** attempt + randomInt(10);
}

export async function runInTransaction<T>(
  dataSource: DataSource,
  work: (manager: EntityManager) => Promise<T>,
  { isolation = 'READ COMMITTED', maxAttempts = 3 }: TransactionOptions = {},
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await dataSource.transaction(isolation, work);
    } catch (error) {
      if (attempt >= maxAttempts || !isRetryable(error)) {
        throw error;
      }
      await sleep(backoffMs(attempt));
    }
  }
}
