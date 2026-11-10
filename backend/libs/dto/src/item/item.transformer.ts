import type { Item } from '@app/database/entities';
import type { ItemDto } from './item.dto';

export type ItemSource = Pick<
  Item,
  'id' | 'type' | 'name' | 'parentId' | 'createdAt'
>;

export function toItemDto(item: ItemSource): ItemDto {
  return {
    id: item.id,
    type: item.type,
    name: item.name,
    parentId: item.parentId,
    createdAt: item.createdAt.toISOString(),
  };
}
