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

describe('DELETE /api/v1/items/{id}', () => {
  let testApp: TestApp;
  let server: App;

  async function countItems(): Promise<number> {
    const [row] = await testApp.dataSource.query<Array<{ count: number }>>(
      'SELECT count(*)::int AS count FROM item',
    );
    return row?.count ?? 0;
  }

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

  it('deletes a folder and its whole subtree: 204 with no body', async () => {
    const top = await createItem(server, {
      type: 'folder',
      parentId: null,
      name: 'top',
    });
    const nested = await createChain(server, ['keep']);
    const leafParent = await createItem(server, {
      type: 'folder',
      name: 'inner',
      parentId: top.id,
    });
    const leaf = await createItem(server, {
      type: 'file',
      name: 'leaf.txt',
      parentId: leafParent.id,
    });

    const response = await request(server)
      .delete(`${ITEMS_URL}/${top.id}`)
      .expect(204);

    expect(response.text).toBe('');
    await request(server).get(`${ITEMS_URL}/${leaf.id}`).expect(404);
    await request(server).get(`${ITEMS_URL}/${nested.id}`).expect(200);
    expect(await countItems()).toBe(1);
  });

  it('answers 404 for an item that is already gone', async () => {
    const file = await createItem(server, {
      parentId: null,
      type: 'file',
      name: 'once.txt',
    });
    await request(server).delete(`${ITEMS_URL}/${file.id}`).expect(204);

    const response = await request(server)
      .delete(`${ITEMS_URL}/${file.id}`)
      .expect(404);

    expect(problemOf(response)).toMatchObject({
      code: 'notFound.itemNotFound',
    });
  });

  it('lets one of several parallel deletes win and answers 404 to the rest', async () => {
    const folder = await createItem(server, {
      type: 'folder',
      parentId: null,
      name: 'contested',
    });

    const responses = await Promise.all(
      Array.from({ length: 5 }, () =>
        request(server).delete(`${ITEMS_URL}/${folder.id}`),
      ),
    );

    expect(
      responses.map((response) => response.status).toSorted((a, b) => a - b),
    ).toEqual([204, 404, 404, 404, 404]);
  });

  it('never leaves an orphan when creates race with the delete of their parent', async () => {
    const folder = await createItem(server, {
      type: 'folder',
      parentId: null,
      name: 'doomed',
    });

    const creates = Array.from({ length: 20 }, (_unused, index) =>
      postItem(server, {
        type: 'file',
        name: `f${String(index)}.txt`,
        parentId: folder.id,
      }),
    );
    const [deleted, ...created] = await Promise.all([
      request(server).delete(`${ITEMS_URL}/${folder.id}`),
      ...creates,
    ]);

    expect(deleted.status).toBe(204);
    expect(
      created.every((response) => [201, 404].includes(response.status)),
    ).toBe(true);
    expect(await countItems()).toBe(0);
  });
});
