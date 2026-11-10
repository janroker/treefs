import { transformAndValidateResponse } from '@app/common/interceptors';
import { type Page } from '@app/common/pagination';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  createItemSchema,
  itemDetailDtoSchema,
  itemIdSchema,
  itemPageDtoSchema,
  itemWithPathDtoSchema,
  listItemsQuerySchema,
  toItemDetailDto,
  toItemPageDto,
  toItemWithPathDto,
  toListQuery,
  toSearchQuery,
} from '../dto';
import { ApiExceptionFilter } from '../../errors/api-exception.filter';
import { validationPipe } from '../../errors/validation';
import { ItemsService } from '../services';
import type {
  CreateItemBody,
  DeleteItemPathParams,
  GetItemPathParams,
  ListItemsQueryParams,
} from '../../types';
import type { ItemWithAncestors } from '../types';

@Controller({ path: 'items', version: '1' })
@UsePipes(validationPipe)
@UseFilters(ApiExceptionFilter)
export class ItemsController {
  public constructor(private readonly items: ItemsService) {}

  @Post()
  @UseInterceptors(
    transformAndValidateResponse(toItemWithPathDto, itemWithPathDtoSchema),
  )
  public async create(
    @Body({ schema: createItemSchema }) body: CreateItemBody,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ItemWithAncestors> {
    const created = await this.items.create(body);
    response.location(`${request.path}/${created.item.id}`);
    return created;
  }

  @Get(':id')
  @UseInterceptors(
    transformAndValidateResponse(toItemDetailDto, itemDetailDtoSchema),
  )
  public get(
    @Param('id', { schema: itemIdSchema }) id: GetItemPathParams['id'],
  ): Promise<ItemWithAncestors> {
    return this.items.get(id);
  }

  @Get()
  @UseInterceptors(
    transformAndValidateResponse(toItemPageDto, itemPageDtoSchema),
  )
  public list(
    @Query({ schema: listItemsQuerySchema }) query: ListItemsQueryParams,
  ): Promise<Page<ItemWithAncestors>> {
    if (query.q !== undefined) {
      return this.items.search(toSearchQuery({ ...query, q: query.q }));
    }
    return this.items.list(toListQuery(query));
  }

  @Delete(':id')
  @HttpCode(204)
  public async delete(
    @Param('id', { schema: itemIdSchema }) id: DeleteItemPathParams['id'],
  ): Promise<void> {
    await this.items.delete(id);
  }
}
