import type { ErrorDto } from '@app/common/dto/error.dto';
import type {
  CreateItemDto,
  ItemIdDto,
  ListItemsQueryDto,
} from './items/dto/in/items-in.dto';
import type {
  ItemDetailDto,
  ItemPageDto,
  ItemWithPathDto,
} from './items/dto/out/items-out.dto';

export type CreateItemBody = CreateItemDto;
export type CreateItemResponse = ItemWithPathDto;

export type GetItemPathParams = { id: ItemIdDto };
export type GetItemResponse = ItemDetailDto;

export type ListItemsQueryParams = ListItemsQueryDto;
export type ListItemsResponse = ItemPageDto;

export type ErrorResponse = ErrorDto;
