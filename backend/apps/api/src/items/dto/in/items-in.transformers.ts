import type { CreateItem } from '@app/database/entities';
import type { CreateItemDto, ListItemsQueryDto } from './items-in.dto';
import type { ListItemsQuery } from '../../types';

export function toCreateItem(
  dto: CreateItemDto,
  parentDepth: number | null,
): CreateItem {
  return {
    type: dto.type,
    name: dto.name,
    parentId: dto.parentId,
    depth: parentDepth === null ? 0 : parentDepth + 1,
  };
}

export function toListQuery(dto: ListItemsQueryDto): ListItemsQuery {
  return {
    parentId: dto.parentId,
    type: dto.type ?? null,
    limit: dto.limit ?? null,
    cursor: dto.cursor ?? null,
  };
}
