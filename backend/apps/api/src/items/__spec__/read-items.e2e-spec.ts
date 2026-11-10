import type { ItemDetailDto, ItemPageDto } from '../dto';
import request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp, type TestApp } from '../../__spec__/support/app';
import { truncateAll, truncateTables } from '@app/database/__spec__/support/db';
import {
  createChain,
  createItem,
  ITEMS_URL,
  problemOf,
} from './support/item-requests';

const TABLES = ['item'] as const;

describe('reading items', () => {
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

  describe('GET /api/v1/items/{id}', () => {
    it('returns the item with its path and ancestors', async () => {
      const folder = await createChain(server, ['a', 'b', 'c']);
      const file = await createItem(server, {
        type: 'file',
        name: 'd.txt',
        parentId: folder.id,
      });

      const response = await request(server)
        .get(`${ITEMS_URL}/${file.id}`)
        .expect(200);

      const detail = response.body as ItemDetailDto;
      expect(detail).toMatchObject({ id: file.id, path: '/a/b/c/d.txt' });
      expect(detail.ancestors.map((ancestor) => ancestor.name)).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    it('answers 404 for an unknown id and 400 for a malformed one', async () => {
      const missing = await request(server)
        .get(`${ITEMS_URL}/0190f1c4-0000-7000-8000-000000000000`)
        .expect(404);
      await request(server).get(`${ITEMS_URL}/not-a-uuid`).expect(400);

      expect(problemOf(missing)).toMatchObject({
        code: 'notFound.itemNotFound',
      });
    });

    it('builds the path of an item 64 levels deep', async () => {
      const names = Array.from(
        { length: 64 },
        (_unused, index) => `level${String(index + 1)}`,
      );

      const deepest = await createChain(server, names);

      expect(deepest.path).toBe(`/${names.join('/')}`);
    });
  });

  describe('GET /api/v1/items?parentId=', () => {
    it('lists the top level in name order', async () => {
      await createItem(server, {
        type: 'folder',
        parentId: null,
        name: 'beta',
      });
      await createItem(server, {
        parentId: null,
        type: 'file',
        name: 'Alpha.txt',
      });
      await createItem(server, {
        type: 'folder',
        parentId: null,
        name: 'gamma',
      });

      const response = await request(server)
        .get(ITEMS_URL)
        .query({ parentId: 'root' })
        .expect(200);

      expect(
        (response.body as ItemPageDto).items.map((item) => item.name),
      ).toEqual(['Alpha.txt', 'beta', 'gamma']);
    });

    it('pages through a folder with an opaque cursor', async () => {
      const folder = await createItem(server, {
        type: 'folder',
        parentId: null,
        name: 'many',
      });
      for (const name of ['e', 'a', 'd', 'b', 'c']) {
        await createItem(server, { type: 'file', name, parentId: folder.id });
      }

      const names: Array<string> = [];
      let cursor: string | null | undefined;
      do {
        const query: Record<string, string> = {
          parentId: folder.id,
          limit: '2',
          ...(typeof cursor === 'string' ? { cursor } : {}),
        };
        const page = (
          await request(server).get(ITEMS_URL).query(query).expect(200)
        ).body as ItemPageDto;
        names.push(...page.items.map((item) => item.name));
        cursor = page.nextCursor;
      } while (cursor !== null);

      expect(names).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    it('filters by type', async () => {
      await createItem(server, {
        type: 'folder',
        parentId: null,
        name: 'folder',
      });
      await createItem(server, {
        parentId: null,
        type: 'file',
        name: 'file.txt',
      });

      const response = await request(server)
        .get(ITEMS_URL)
        .query({ parentId: 'root', type: 'file' })
        .expect(200);

      expect(
        (response.body as ItemPageDto).items.map((item) => item.name),
      ).toEqual(['file.txt']);
    });

    it('answers 404 for a missing folder, 422 for a file and 400 for a tampered cursor', async () => {
      const file = await createItem(server, {
        parentId: null,
        type: 'file',
        name: 'a.txt',
      });

      await request(server)
        .get(ITEMS_URL)
        .query({ parentId: '0190f1c4-0000-7000-8000-000000000000' })
        .expect(404);
      await request(server)
        .get(ITEMS_URL)
        .query({ parentId: file.id })
        .expect(422);
      const tampered = await request(server)
        .get(ITEMS_URL)
        .query({ parentId: 'root', cursor: 'bm90LWpzb24' });

      expect(problemOf(tampered)).toMatchObject({
        statusCode: 400,
        code: 'badRequest.invalidCursor',
      });
    });
  });
});
