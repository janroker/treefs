import { exceptionStatus } from '@app/common/errors';
import { type ItemType } from '@app/common/enums';
import { type CreateItem, Item } from '@app/database/entities';
import { GenericRepository } from '@app/database/repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository, SelectQueryBuilder } from 'typeorm';
import type {
  Ancestor,
  AncestorRow,
  ChildrenQuery,
  ItemRow,
  NameQuery,
  PrefixQuery,
} from '../types';

const ALIAS = 'item';

const PREFIX_KEY = 'lower(normalize(:prefix, NFC))';
const MAX_CODE_POINT = 'chr(1114111)';

const ANCESTOR_CHAINS_SQL = /* sql */ `
  WITH RECURSIVE
    chain AS (
      SELECT
        "id" AS "startId",
        "id",
        "parentId",
        "name",
        0 AS distance
      FROM
        "item"
      WHERE
        "id" = ANY ($1::UUID[])
      UNION ALL
      SELECT
        chain."startId",
        parent."id",
        parent."parentId",
        parent."name",
        chain.distance + 1
      FROM
        chain
        JOIN "item" parent ON parent."id" = chain."parentId"
    )
  SELECT
    "startId",
    "id",
    "name"
  FROM
    chain
  ORDER BY
    "startId",
    distance DESC
`;

@Injectable()
export class ItemsRepository extends GenericRepository<Item, CreateItem> {
  public constructor(@InjectRepository(Item) repository: Repository<Item>) {
    super(Item, repository, exceptionStatus.ITEM_NOT_FOUND);
  }

  public listChildren({
    parentId,
    type,
    limit,
    afterNameKey,
  }: ChildrenQuery): Promise<Array<ItemRow>> {
    const query = this.getRepo().createQueryBuilder(ALIAS);
    this.whereParent(query, parentId);
    this.whereType(query, type);
    this.whereAfterNameKey(query, afterNameKey);
    return query.orderBy(`${ALIAS}.nameKey`).limit(limit).getMany();
  }

  public findByNameInFolder(
    parentId: string | null,
    name: string,
    type: ItemType | null,
  ): Promise<Array<ItemRow>> {
    const query = this.getRepo().createQueryBuilder(ALIAS);
    this.whereSameName(query, name);
    this.whereParent(query, parentId);
    this.whereType(query, type);
    return query.getMany();
  }

  public findByName({
    name,
    type,
    limit,
    afterId,
  }: NameQuery): Promise<Array<ItemRow>> {
    const query = this.getRepo().createQueryBuilder(ALIAS);
    this.whereSameName(query, name);
    this.whereType(query, type);
    this.whereIdAfter(query, afterId);
    return query.orderBy(`${ALIAS}.id`).limit(limit).getMany();
  }

  public findByPrefix({
    prefix,
    type,
    parentId,
    limit,
    beforeId,
  }: PrefixQuery): Promise<Array<ItemRow>> {
    const query = this.getRepo().createQueryBuilder(ALIAS);
    this.whereNamePrefix(query, prefix);
    this.whereType(query, type);
    if (parentId !== undefined) {
      this.whereParent(query, parentId);
    }
    this.whereIdBefore(query, beforeId);
    return query.orderBy(`${ALIAS}.id`, 'DESC').limit(limit).getMany();
  }

  public async deleteSubtree(id: string): Promise<boolean> {
    const result = await this.getRepo().delete(id);
    return (result.affected ?? 0) > 0;
  }

  public async ancestorChains(
    folderIds: ReadonlyArray<string>,
  ): Promise<Map<string, Array<Ancestor>>> {
    const chains = new Map<string, Array<Ancestor>>();
    if (folderIds.length === 0) {
      return chains;
    }
    const rows = await this.getRepo().query<Array<AncestorRow>>(
      ANCESTOR_CHAINS_SQL,
      [folderIds],
    );
    for (const { startId, id, name } of rows) {
      const chain = chains.get(startId) ?? [];
      chain.push({ id, name });
      chains.set(startId, chain);
    }
    return chains;
  }

  private whereParent(
    query: SelectQueryBuilder<Item>,
    parentId: string | null,
  ): void {
    if (parentId === null) {
      query.andWhere(`${ALIAS}.parentId IS NULL`);
      return;
    }
    query.andWhere(`${ALIAS}.parentId = :parentId`, { parentId });
  }

  private whereType(
    query: SelectQueryBuilder<Item>,
    type: ItemType | null,
  ): void {
    if (type !== null) {
      query.andWhere(`${ALIAS}.type = :type`, { type });
    }
  }

  private whereAfterNameKey(
    query: SelectQueryBuilder<Item>,
    afterNameKey: string | null,
  ): void {
    if (afterNameKey !== null) {
      query.andWhere(`${ALIAS}.nameKey > :afterNameKey`, { afterNameKey });
    }
  }

  private whereSameName(query: SelectQueryBuilder<Item>, name: string): void {
    query.andWhere(`${ALIAS}.nameKey = lower(normalize(:name, NFC))`, { name });
  }

  private whereNamePrefix(
    query: SelectQueryBuilder<Item>,
    prefix: string,
  ): void {
    if (prefix.length === 0) {
      return;
    }
    query.andWhere(
      `${ALIAS}.nameKey >= ${PREFIX_KEY} AND ${ALIAS}.nameKey < ${PREFIX_KEY} || ${MAX_CODE_POINT}`,
      { prefix },
    );
  }

  private whereIdAfter(
    query: SelectQueryBuilder<Item>,
    afterId: string | null,
  ): void {
    if (afterId !== null) {
      query.andWhere(`${ALIAS}.id > :afterId`, { afterId });
    }
  }

  private whereIdBefore(
    query: SelectQueryBuilder<Item>,
    beforeId: string | null,
  ): void {
    if (beforeId !== null) {
      query.andWhere(`${ALIAS}.id < :beforeId`, { beforeId });
    }
  }
}
