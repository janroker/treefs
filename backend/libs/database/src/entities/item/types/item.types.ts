import type { Item } from '../item.entity';

export type CreateItem = Omit<Item, 'id' | 'nameKey' | 'createdAt' | 'parent'>;
