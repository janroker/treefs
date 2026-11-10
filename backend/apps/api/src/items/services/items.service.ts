import {
  ConflictException,
  exceptionStatus,
  NotFoundException,
  UnprocessableException,
} from '@app/common/errors';
import { decodeCursor, type Page, toPage } from '@app/common/pagination';
import { itemType } from '@app/common/enums';
import { MAX_ITEM_DEPTH } from '@app/common/constants';
import { runInTransaction } from '@app/database/transaction';
import { sqlState, sqlStateOf } from '@app/database/postgres-error';
import { Injectable } from '@nestjs/common';
import { DataSource, type EntityManager } from 'typeorm';
import {
  DEFAULT_EXACT_LIMIT,
  DEFAULT_LIST_LIMIT,
  DEFAULT_PREFIX_LIMIT,
  ROOT,
} from '../constants';
import { type CreateItemDto, toCreateItem } from '../dto';
import { matchMode } from '../enums';
import { ItemsRepository } from '../repositories';
import { idCursorSchema, nameCursorSchema } from '../schemas';
import type {
  ItemRow,
  ItemWithAncestors,
  ListItemsQuery,
  SearchItemsQuery,
} from '../types';

@Injectable()
export class ItemsService {
  public constructor(
    private readonly repository: ItemsRepository,
    private readonly dataSource: DataSource,
  ) {}

  public async create(dto: CreateItemDto): Promise<ItemWithAncestors> {
    const item = await runInTransaction(this.dataSource, (manager) =>
      this.insert(dto, manager),
    );
    return this.withAncestorsOf(item);
  }

  public async get(id: string): Promise<ItemWithAncestors> {
    const item = await this.repository.findOneOrThrow({ where: { id } });
    return this.withAncestorsOf(item);
  }

  public async list({
    parentId,
    type,
    limit,
    cursor,
  }: ListItemsQuery): Promise<Page<ItemWithAncestors>> {
    const pageSize = limit ?? DEFAULT_LIST_LIMIT;
    const after = decodeCursor(cursor, nameCursorSchema);
    const rows = await this.repository.listChildren({
      parentId: await this.folderOrRoot(parentId),
      type,
      limit: pageSize + 1,
      afterNameKey: after?.k ?? null,
    });
    const page = toPage(rows, pageSize, (last) => ({ k: last.nameKey }));
    return {
      items: await this.withAncestors(page.items),
      nextCursor: page.nextCursor,
    };
  }

  public async search(
    query: SearchItemsQuery,
  ): Promise<Page<ItemWithAncestors>> {
    const folder =
      query.parentId === null
        ? undefined
        : await this.folderOrRoot(query.parentId);
    if (query.match === matchMode.PREFIX) {
      return this.searchPrefix(query, folder);
    }
    if (folder !== undefined) {
      const rows = await this.repository.findByNameInFolder(
        folder,
        query.q,
        query.type,
      );
      return { items: await this.withAncestors(rows), nextCursor: null };
    }
    return this.searchExactEverywhere(query);
  }

  public async delete(id: string): Promise<void> {
    if (!(await this.repository.deleteSubtree(id))) {
      throw new NotFoundException(
        `Item ${id} does not exist`,
        exceptionStatus.ITEM_NOT_FOUND,
      );
    }
  }

  private static assertDepthAvailable(parent: ItemRow | null): void {
    if (parent !== null && parent.depth >= MAX_ITEM_DEPTH) {
      throw new UnprocessableException(
        `Folders can be nested at most ${String(MAX_ITEM_DEPTH)} levels deep`,
        exceptionStatus.DEPTH_EXCEEDED,
      );
    }
  }

  private static assertFolder(
    item: ItemRow | null,
    id: string,
  ): asserts item is ItemRow {
    if (item === null) {
      throw new NotFoundException(
        `Folder ${id} does not exist`,
        exceptionStatus.PARENT_NOT_FOUND,
      );
    }
    if (item.type !== itemType.FOLDER) {
      throw new UnprocessableException(
        `Item ${id} is a file, not a folder`,
        exceptionStatus.PARENT_NOT_FOLDER,
      );
    }
  }

  private static assertNotNameTaken(error: unknown, dto: CreateItemDto): void {
    if (sqlStateOf(error) === sqlState.UNIQUE_VIOLATION) {
      throw new ConflictException(
        `An item named "${dto.name}" already exists in this folder`,
        exceptionStatus.NAME_TAKEN,
      );
    }
  }

  private static assertParentExists(error: unknown, dto: CreateItemDto): void {
    if (sqlStateOf(error) === sqlState.FOREIGN_KEY_VIOLATION) {
      throw new NotFoundException(
        `Folder ${String(dto.parentId)} does not exist`,
        exceptionStatus.PARENT_NOT_FOUND,
      );
    }
  }

  private static parentIdsOf(items: ReadonlyArray<ItemRow>): Array<string> {
    const parentIds = new Set<string>();
    for (const item of items) {
      if (item.parentId !== null) {
        parentIds.add(item.parentId);
      }
    }
    return [...parentIds];
  }

  private async insert(
    dto: CreateItemDto,
    manager: EntityManager,
  ): Promise<ItemRow> {
    const parent =
      dto.parentId === null
        ? null
        : await this.requireFolder(dto.parentId, manager);
    ItemsService.assertDepthAvailable(parent);
    const id = await this.repository
      .insert(toCreateItem(dto, parent?.depth ?? null), manager)
      .catch((error: unknown) => {
        ItemsService.assertNotNameTaken(error, dto);
        ItemsService.assertParentExists(error, dto);
        throw error;
      });
    return this.repository.findOneOrThrow({ where: { id } }, manager);
  }

  private async searchExactEverywhere(
    query: SearchItemsQuery,
  ): Promise<Page<ItemWithAncestors>> {
    const limit = query.limit ?? DEFAULT_EXACT_LIMIT;
    const after = decodeCursor(query.cursor, idCursorSchema);
    const rows = await this.repository.findByName({
      name: query.q,
      type: query.type,
      limit: limit + 1,
      afterId: after?.id ?? null,
    });
    const page = toPage(rows, limit, (last) => ({ id: last.id }));
    return {
      items: await this.withAncestors(page.items),
      nextCursor: page.nextCursor,
    };
  }

  private async searchPrefix(
    query: SearchItemsQuery,
    folder: string | null | undefined,
  ): Promise<Page<ItemWithAncestors>> {
    const limit = query.limit ?? DEFAULT_PREFIX_LIMIT;
    const before = decodeCursor(query.cursor, idCursorSchema);
    const rows = await this.repository.findByPrefix({
      prefix: query.q,
      type: query.type,
      parentId: folder,
      limit: limit + 1,
      beforeId: before?.id ?? null,
    });
    const page = toPage(rows, limit, (last) => ({ id: last.id }));
    return {
      items: await this.withAncestors(page.items),
      nextCursor: page.nextCursor,
    };
  }

  private async withAncestorsOf(item: ItemRow): Promise<ItemWithAncestors> {
    if (item.parentId === null) {
      return { item, ancestors: [] };
    }
    const chains = await this.repository.ancestorChains([item.parentId]);
    return { item, ancestors: chains.get(item.parentId) ?? [] };
  }

  private async withAncestors(
    items: ReadonlyArray<ItemRow>,
  ): Promise<Array<ItemWithAncestors>> {
    const parentIds = ItemsService.parentIdsOf(items);
    const chains = await this.repository.ancestorChains(parentIds);
    return items.map((item) => ({
      item,
      ancestors:
        item.parentId === null ? [] : (chains.get(item.parentId) ?? []),
    }));
  }

  private async folderOrRoot(parentId: string): Promise<string | null> {
    if (parentId === ROOT) {
      return null;
    }
    const folder = await this.requireFolder(parentId);
    return folder.id;
  }

  private async requireFolder(
    id: string,
    manager?: EntityManager,
  ): Promise<ItemRow> {
    const item = await this.repository.findOne({ where: { id } }, manager);
    ItemsService.assertFolder(item, id);
    return item;
  }
}
