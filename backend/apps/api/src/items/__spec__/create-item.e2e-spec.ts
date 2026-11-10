import type { ItemWithPathDto } from '../dto';
import request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp, type TestApp } from '../../__spec__/support/app';
import { truncateAll, truncateTables } from '@app/database/__spec__/support/db';
import {
  createChain,
  createItem,
  ITEMS_URL,
  postItem,
  problemOf,
} from './support/item-requests';

const TABLES = ['item'] as const;

describe('POST /api/v1/items', () => {
  let testApp: TestApp;
  let server: App;

  beforeAll(async () => {
    testApp = await createTestApp();
    server = testApp.app.getHttpServer();
  });

  afterEach(async () => {
    await truncateTables(testApp.dataSource, TABLES);
  });

  afterAll(async () => {
    await truncateAll(testApp.dataSource);
    await testApp.app.close();
  });

  it('creates a top-level folder: 201, Location and the item with its path', async () => {
    const response = await postItem(server, {
      type: 'folder',
      parentId: null,
      name: 'Projects',
    }).expect(201);
    const item = response.body as ItemWithPathDto;

    expect(response.headers.location).toBe(`${ITEMS_URL}/${item.id}`);
    expect(item).toMatchObject({
      type: 'folder',
      name: 'Projects',
      parentId: null,
      path: '/Projects',
    });
  });

  it('creates a file inside nested folders with the full path', async () => {
    const folder = await createChain(server, ['Projects', '2026']);

    const file = await createItem(server, {
      type: 'file',
      name: 'report.pdf',
      parentId: folder.id,
    });

    expect(file).toMatchObject({
      type: 'file',
      parentId: folder.id,
      path: '/Projects/2026/report.pdf',
    });
  });

  it('allows a file at the top level', async () => {
    await expect(
      createItem(server, { parentId: null, type: 'file', name: 'notes.txt' }),
    ).resolves.toMatchObject({
      path: '/notes.txt',
    });
  });

  it('answers 409 for a name that differs only in case', async () => {
    await createItem(server, { type: 'folder', parentId: null, name: 'Docs' });

    const response = await postItem(server, {
      type: 'folder',
      parentId: null,
      name: 'DOCS',
    }).expect(409);

    expect(problemOf(response)).toMatchObject({
      code: 'conflict.nameTaken',
      statusCode: 409,
    });
  });

  it('answers 404 when the parent folder does not exist', async () => {
    const response = await postItem(server, {
      type: 'folder',
      name: 'x',
      parentId: '0190f1c4-0000-7000-8000-000000000000',
    }).expect(404);

    expect(problemOf(response)).toMatchObject({
      code: 'notFound.parentNotFound',
    });
  });

  it('answers 422 when the parent is a file', async () => {
    const file = await createItem(server, {
      parentId: null,
      type: 'file',
      name: 'a.txt',
    });

    const response = await postItem(server, {
      type: 'folder',
      name: 'b',
      parentId: file.id,
    }).expect(422);

    expect(problemOf(response)).toMatchObject({
      code: 'unprocessable.parentNotFolder',
    });
  });

  it('answers 422 below the 64-level depth limit', async () => {
    const [row] = await testApp.dataSource.query<Array<{ id: string }>>(
      `INSERT INTO item (type, name, depth) VALUES ('folder', 'deepest', 64) RETURNING id`,
    );

    const response = await postItem(server, {
      type: 'folder',
      name: 'too-deep',
      parentId: row?.id ?? null,
    }).expect(422);

    expect(problemOf(response)).toMatchObject({
      code: 'unprocessable.depthExceeded',
    });
  });

  it.each([
    [
      'an invalid name',
      { type: 'folder', name: 'a/b', parentId: null },
      'name',
    ],
    ['an unknown type', { type: 'link', name: 'x', parentId: null }, 'type'],
    [
      'an unknown field',
      { type: 'folder', name: 'x', parentId: null, owner: 'me' },
      '',
    ],
    [
      'a malformed parent id',
      { type: 'folder', name: 'x', parentId: 'not-a-uuid' },
      'parentId',
    ],
  ])('answers 400 for %s and names the field', async (_label, body, path) => {
    const response = await request(server)
      .post(ITEMS_URL)
      .send(body)
      .expect(400);
    const problem = problemOf(response);

    expect(problem).toMatchObject({
      code: 'validation.validation',
      statusCode: 400,
    });
    expect(problem.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ path })]),
    );
  });

  it('stores SQL and wildcard characters as literal text', async () => {
    const name = `%_'; DROP TABLE item; --`;

    await expect(
      createItem(server, { parentId: null, type: 'file', name }),
    ).resolves.toMatchObject({ name });
  });

  it('lets exactly one of 50 parallel creates of the same name win', async () => {
    const responses = await Promise.all(
      Array.from({ length: 50 }, () =>
        postItem(server, { type: 'folder', parentId: null, name: 'race' }),
      ),
    );
    const statuses = responses.map((response) => response.status);

    expect(statuses.filter((status) => status === 201)).toHaveLength(1);
    expect(statuses.filter((status) => status === 409)).toHaveLength(49);
  });
});
