import type { ItemType } from '@app/common/enums';
import type { Item } from '@app/database/entities';

export type ItemRow = Pick<
  Item,
  'id' | 'type' | 'parentId' | 'name' | 'nameKey' | 'depth' | 'createdAt'
>;

export type AncestorRow = {
  startId: string;
  id: string;
  name: string;
};

export type Ancestor = Pick<AncestorRow, 'id' | 'name'>;

type Filters = {
  type: ItemType | null;
  limit: number;
};

export type ChildrenQuery = Filters & {
  parentId: string | null;
  afterNameKey: string | null;
};

export type NameQuery = Filters & {
  name: string;
  afterId: string | null;
};

export type PrefixQuery = Filters & {
  prefix: string;
  parentId: string | null | undefined;
  beforeId: string | null;
};
