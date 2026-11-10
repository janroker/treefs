import type { TestingModule } from '@nestjs/testing';
import { DataSource, type EntityManager } from 'typeorm';
import { runInTransaction } from '../transaction';
import { createDatabaseTestModule } from './support/database-test-module';
import { truncateTables } from './support/db';

const TABLES = ['tx_probe'] as const;

function barrier(parties: number): () => Promise<void> {
  let waiting = 0;
  let release: (() => void) | undefined;
  const opened = new Promise<void>((resolve) => {
    release = resolve;
  });
  return async () => {
    waiting++;
    if (waiting === parties) {
      release?.();
    }
    await opened;
  };
}

describe('runInTransaction', () => {
  let moduleRef: TestingModule;
  let dataSource: DataSource;

  beforeAll(async () => {
    moduleRef = await createDatabaseTestModule();
    dataSource = moduleRef.get(DataSource);
    await dataSource.query(
      'CREATE TABLE IF NOT EXISTS tx_probe (id serial PRIMARY KEY, total int NOT NULL)',
    );
  });

  afterEach(async () => {
    await truncateTables(dataSource, TABLES);
  });

  afterAll(async () => {
    await dataSource.query('DROP TABLE IF EXISTS tx_probe');
    await moduleRef.close();
  });

  it('commits the work and returns its result', async () => {
    const id = await runInTransaction(dataSource, async (manager) => {
      const rows: Array<{ id: number }> = await manager.query(
        'INSERT INTO tx_probe (total) VALUES (1) RETURNING id',
      );
      return rows[0]?.id;
    });

    expect(id).toBeTypeOf('number');
  });

  it('rolls back when the work throws', async () => {
    const failing = runInTransaction(dataSource, async (manager) => {
      await manager.query('INSERT INTO tx_probe (total) VALUES (1)');
      throw new Error('boom');
    });

    await expect(failing).rejects.toThrow('boom');
    expect(await dataSource.query('SELECT * FROM tx_probe')).toEqual([]);
  });

  it('retries a serialization failure until both transactions commit', async () => {
    const bothHaveRead = barrier(2);
    let attempts = 0;
    const work = async (manager: EntityManager): Promise<void> => {
      attempts++;
      const [row] = await manager.query<Array<{ sum: number }>>(
        'SELECT coalesce(sum(total), 0)::int AS sum FROM tx_probe',
      );
      if (attempts <= 2) {
        await bothHaveRead();
      }
      await manager.query('INSERT INTO tx_probe (total) VALUES ($1)', [
        (row?.sum ?? 0) + 1,
      ]);
    };

    await Promise.all([
      runInTransaction(dataSource, work, { isolation: 'SERIALIZABLE' }),
      runInTransaction(dataSource, work, { isolation: 'SERIALIZABLE' }),
    ]);

    expect(attempts).toBe(3);
    expect(
      await dataSource.query('SELECT total FROM tx_probe ORDER BY total'),
    ).toEqual([{ total: 1 }, { total: 2 }]);
  });
});
