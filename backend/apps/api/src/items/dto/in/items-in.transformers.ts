import type { CreateItem } from '@app/database/entities';
import type { CreateItemDto, ListItemsQueryDto } from './items-in.dto';
import { ROOT } from '../../constants';
import type { ListItemsQuery, SearchItemsQuery } from '../../types';

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
    parentId: dto.parentId ?? ROOT,
    type: dto.type ?? null,
    limit: dto.limit ?? null,
    cursor: dto.cursor ?? null,
  };
}

export function toSearchQuery(
  dto: ListItemsQueryDto & { q: string },
): SearchItemsQuery {
  return {
    q: dto.q,
    match: dto.match,
    parentId: dto.parentId ?? null,
    type: dto.type ?? null,
    limit: dto.limit ?? null,
    cursor: dto.cursor ?? null,
  };
}
