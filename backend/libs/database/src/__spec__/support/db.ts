import type { DataSource } from 'typeorm';

const verified = new WeakSet<DataSource>();

async function assertTestDatabase(dataSource: DataSource): Promise<void> {
  if (verified.has(dataSource)) {
    return;
  }
  const [row] = await dataSource.query<Array<{ name: string }>>(
    'SELECT current_database() AS name',
  );
  if (row?.name.endsWith('_test') !== true) {
    throw new Error(
      `Refusing to clean database "${row?.name ?? 'unknown'}": its name must end in _test`,
    );
  }
  verified.add(dataSource);
}

async function listTables(dataSource: DataSource): Promise<Array<string>> {
  const rows = await dataSource.query<Array<{ tablename: string }>>(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> 'migrations'`,
  );
  return rows.map((row) => row.tablename);
}

export async function truncateTables(
  dataSource: DataSource,
  tables: ReadonlyArray<string>,
): Promise<void> {
  await assertTestDatabase(dataSource);
  if (tables.length === 0) {
    return;
  }
  const list = tables
    .map((table) => `"${table.replaceAll('"', '""')}"`)
    .join(', ');
  await dataSource.query(`TRUNCATE ${list} RESTART IDENTITY CASCADE`);
}

export async function truncateAll(dataSource: DataSource): Promise<void> {
  await truncateTables(dataSource, await listTables(dataSource));
}
