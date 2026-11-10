import type { ItemType } from '@app/common/enums';
import type { Ancestor, ItemRow } from './items-repository.types';

export type ListItemsQuery = {
  parentId: string;
  type: ItemType | null;
  limit: number | null;
  cursor: string | null;
};

export type ItemWithAncestors = {
  item: ItemRow;
  ancestors: Array<Ancestor>;
};
