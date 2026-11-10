import type { ItemPageDto } from '../dto';
import request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp, type TestApp } from '../../__spec__/support/app';
import { truncateAll, truncateTables } from '@app/database/__spec__/support/db';
import { createItem, ITEMS_URL, problemOf } from './support/item-requests';

const TABLES = ['item'] as const;
const COMBINING_ACUTE = String.fromCodePoint(0x301);

describe('GET /api/v1/items?q= (search)', () => {
  let testApp: TestApp;
  let server: App;

  async function search(query: Record<string, string>): Promise<ItemPageDto> {
    const response = await request(server)
      .get(ITEMS_URL)
      .query(query)
      .expect(200);
    return response.body as ItemPageDto;
  }

  async function names(query: Record<string, string>): Promise<Array<string>> {
    return (await search(query)).items.map((item) => item.name);
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

  describe('exact', () => {
    it('finds a file in one folder regardless of case and Unicode normalisation', async () => {
      const folder = await createItem(server, {
        type: 'folder',
        parentId: null,
        name: 'docs',
      });
      await createItem(server, {
        type: 'file',
        name: 'Caf\u00e9.txt'.normalize('NFC'),
        parentId: folder.id,
      });

      const query = {
        q: `CAFE${COMBINING_ACUTE}.TXT`,
        match: 'exact',
        parentId: folder.id,
      };

      expect(await names(query)).toEqual(['Caf\u00e9.txt'.normalize('NFC')]);
    });

    it('searches only the direct children of the folder', async () => {
      const outer = await createItem(server, {
        type: 'folder',
        parentId: null,
        name: 'outer',
      });
      const inner = await createItem(server, {
        type: 'folder',
        name: 'inner',
        parentId: outer.id,
      });
      await createItem(server, {
        type: 'file',
        name: 'deep.txt',
        parentId: inner.id,
      });

      expect(
        await names({ q: 'deep.txt', match: 'exact', parentId: outer.id }),
      ).toEqual([]);
    });

    it('finds the same name across folders, paged, with full paths', async () => {
      for (const folderName of ['a', 'b', 'c']) {
        const folder = await createItem(server, {
          type: 'folder',
          parentId: null,
          name: folderName,
        });
        await createItem(server, {
          type: 'file',
          name: 'README.md',
          parentId: folder.id,
        });
      }

      const first = await search({
        q: 'readme.md',
        match: 'exact',
        type: 'file',
        limit: '2',
      });
      const second = await search({
        q: 'readme.md',
        match: 'exact',
        type: 'file',
        cursor: first.nextCursor ?? '',
      });
      const paths = [...first.items, ...second.items]
        .map((item) => item.path)
        .toSorted((a, b) => a.localeCompare(b));

      expect(paths).toEqual(['/a/README.md', '/b/README.md', '/c/README.md']);
      expect(second.nextCursor).toBeNull();
    });

    it('answers 200 with an empty list when nothing matches', async () => {
      await expect(search({ q: 'nothing', match: 'exact' })).resolves.toEqual({
        items: [],
        nextCursor: null,
      });
    });
  });

  describe('prefix (typeahead)', () => {
    it('returns at most 10 matches, newest first', async () => {
      for (let index = 0; index < 12; index++) {
        await createItem(server, {
          parentId: null,
          type: 'file',
          name: `report-${String(index).padStart(2, '0')}.pdf`,
        });
      }
      await createItem(server, {
        parentId: null,
        type: 'file',
        name: 'other.pdf',
      });

      const page = await search({ q: 'REP' });

      expect(page.items.map((item) => item.name)).toEqual(
        Array.from(
          { length: 10 },
          (_unused, index) =>
            `report-${String(11 - index).padStart(2, '0')}.pdf`,
        ),
      );
      expect(page.nextCursor).not.toBeNull();
    });

    it('lists the newest items for an empty prefix', async () => {
      await createItem(server, {
        type: 'folder',
        parentId: null,
        name: 'older',
      });
      await createItem(server, {
        parentId: null,
        type: 'file',
        name: 'newer.txt',
      });

      expect(await names({ q: '' })).toEqual(['newer.txt', 'older']);
    });

    it('treats % and _ as plain characters, not wildcards', async () => {
      await createItem(server, {
        parentId: null,
        type: 'file',
        name: 'abc.txt',
      });
      await createItem(server, {
        parentId: null,
        type: 'file',
        name: 'a_c.txt',
      });

      expect(await names({ q: 'a_' })).toEqual(['a_c.txt']);
      expect(await names({ q: '%' })).toEqual([]);
    });

    it('filters by type and by folder', async () => {
      const folder = await createItem(server, {
        type: 'folder',
        parentId: null,
        name: 'plans',
      });
      await createItem(server, {
        type: 'file',
        name: 'plan-a.md',
        parentId: folder.id,
      });
      await createItem(server, {
        parentId: null,
        type: 'file',
        name: 'plan-b.md',
      });

      expect(await names({ q: 'plan', type: 'folder' })).toEqual(['plans']);
      expect(await names({ q: 'plan', parentId: folder.id })).toEqual([
        'plan-a.md',
      ]);
    });
  });

  it.each([
    ['an exact search without text', { q: '', match: 'exact' }],
    ['no q and no parentId', { type: 'file' }],
    ['an unknown match mode', { q: 'a', match: 'fuzzy' }],
    ['a limit above 100', { q: 'a', limit: '101' }],
  ])('answers 400 for %s', async (_label, query) => {
    const response = await request(server)
      .get(ITEMS_URL)
      .query(query)
      .expect(400);

    expect(problemOf(response)).toMatchObject({
      code: 'validation.validation',
    });
  });
});
