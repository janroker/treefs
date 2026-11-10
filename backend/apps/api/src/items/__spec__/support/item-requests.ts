import type { ItemType } from '@app/common/enums';
import type { ItemWithPathDto } from '../../dto';
import request from 'supertest';
import type { App } from 'supertest/types';

export const ITEMS_URL = '/api/v1/items';

type CreateInput = {
  name: string;
  type: ItemType;
  parentId: string | null;
};

export function postItem(server: App, input: CreateInput): request.Test {
  return request(server).post(ITEMS_URL).send(input);
}

export async function createItem(
  server: App,
  input: CreateInput,
): Promise<ItemWithPathDto> {
  const response = await postItem(server, input).expect(201);
  return response.body as ItemWithPathDto;
}

export async function createChain(
  server: App,
  names: ReadonlyArray<string>,
): Promise<ItemWithPathDto> {
  let parentId: string | null = null;
  let last: ItemWithPathDto | undefined;
  for (const name of names) {
    last = await createItem(server, { name, parentId, type: 'folder' });
    parentId = last.id;
  }
  if (last === undefined) {
    throw new Error('createChain needs at least one name');
  }
  return last;
}

export function problemOf(response: request.Response): Record<string, unknown> {
  return JSON.parse(response.text) as Record<string, unknown>;
}
