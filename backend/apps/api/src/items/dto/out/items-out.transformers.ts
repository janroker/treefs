import { toItemDto } from '@app/dto/item';
import type { Page } from '@app/common/pagination';
import type { Ancestor, ItemWithAncestors } from '../../types';
import type {
  ItemDetailDto,
  ItemPageDto,
  ItemWithPathDto,
} from './items-out.dto';

function pathOf({ item, ancestors }: ItemWithAncestors): string {
  const names = [...ancestors.map((ancestor) => ancestor.name), item.name];
  return `/${names.join('/')}`;
}

export function toItemWithPathDto(source: ItemWithAncestors): ItemWithPathDto {
  return { ...toItemDto(source.item), path: pathOf(source) };
}

export function toItemDetailDto(source: ItemWithAncestors): ItemDetailDto {
  const ancestors: Array<Ancestor> = source.ancestors;
  return { ...toItemWithPathDto(source), ancestors };
}

export function toItemPageDto(page: Page<ItemWithAncestors>): ItemPageDto {
  return {
    items: page.items.map((source) => toItemWithPathDto(source)),
    nextCursor: page.nextCursor,
  };
}
