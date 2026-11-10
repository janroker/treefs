import { type ExceptionStatus, NotFoundException } from '@app/common/errors';
import type {
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  QueryDeepPartialEntity,
  Repository,
  UpsertOptions,
} from 'typeorm';
import { getInsertedId, getInsertedIds } from '../query/get-inserted-id';

type Criteria<Entity extends ObjectLiteral> =
  string | Array<string> | FindOptionsWhere<Entity>;

type ConflictPaths<Entity extends ObjectLiteral> =
  Array<string> | UpsertOptions<Entity>;

export abstract class GenericRepository<
  Entity extends ObjectLiteral,
  Create extends QueryDeepPartialEntity<Entity> = never,
  Update extends QueryDeepPartialEntity<Entity> = never,
> {
  public constructor(
    private readonly entityClass: EntityTarget<Entity>,
    private readonly repository: Repository<Entity>,
    protected readonly notFoundStatus: ExceptionStatus,
  ) {}

  public findOne(
    options: FindOneOptions<Entity>,
    manager?: EntityManager,
  ): Promise<Entity | null> {
    return this.getRepo(manager).findOne(options);
  }

  public async findOneOrThrow(
    options: FindOneOptions<Entity>,
    manager?: EntityManager,
  ): Promise<Entity> {
    const entity = await this.findOne(options, manager);
    if (entity !== null) {
      return entity;
    }
    throw this.notFound(options);
  }

  public async findOneOrCreate(
    options: FindOneOptions<Entity>,
    create: Create,
    manager?: EntityManager,
  ): Promise<Entity> {
    const entity = await this.findOne(options, manager);
    if (entity !== null) {
      return entity;
    }
    await this.insert(create, manager);
    return this.findOneOrThrow(options, manager);
  }

  public findMany(
    options?: FindManyOptions<Entity>,
    manager?: EntityManager,
  ): Promise<Array<Entity>> {
    return this.getRepo(manager).find(options);
  }

  public exists(
    options?: FindManyOptions<Entity>,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.getRepo(manager).exists(options);
  }

  public async existsOrThrow(
    options?: FindManyOptions<Entity>,
    manager?: EntityManager,
  ): Promise<void> {
    if (!(await this.exists(options, manager))) {
      throw this.notFound(options);
    }
  }

  public count(
    options?: FindManyOptions<Entity>,
    manager?: EntityManager,
  ): Promise<number> {
    return this.getRepo(manager).count(options);
  }

  public async delete(
    criteria: Criteria<Entity>,
    manager?: EntityManager,
  ): Promise<void> {
    await this.getRepo(manager).delete(criteria);
  }

  public async softDelete(
    criteria: Criteria<Entity>,
    manager?: EntityManager,
  ): Promise<void> {
    await this.getRepo(manager).softDelete(criteria);
  }

  public async restore(
    criteria: Criteria<Entity>,
    manager?: EntityManager,
  ): Promise<void> {
    await this.getRepo(manager).restore(criteria);
  }

  public async insert(data: Create, manager?: EntityManager): Promise<string> {
    return getInsertedId(await this.getRepo(manager).insert(data));
  }

  public async bulkInsert(
    data: Array<Create>,
    manager?: EntityManager,
  ): Promise<Array<string>> {
    return getInsertedIds(await this.getRepo(manager).insert(data));
  }

  public async update(
    criteria: Criteria<Entity>,
    data: Update,
    manager?: EntityManager,
  ): Promise<void> {
    await this.getRepo(manager).update(criteria, data);
  }

  public async upsert(
    entity: QueryDeepPartialEntity<Entity>,
    conflictPaths: ConflictPaths<Entity>,
    manager?: EntityManager,
  ): Promise<string> {
    return getInsertedId(
      await this.getRepo(manager).upsert(entity, conflictPaths),
    );
  }

  public async bulkUpsert(
    entities: Array<QueryDeepPartialEntity<Entity>>,
    conflictPaths: ConflictPaths<Entity>,
    manager?: EntityManager,
  ): Promise<Array<string>> {
    return getInsertedIds(
      await this.getRepo(manager).upsert(entities, conflictPaths),
    );
  }

  protected getRepo(manager?: EntityManager): Repository<Entity> {
    return manager?.getRepository<Entity>(this.entityClass) ?? this.repository;
  }

  private notFound(options: unknown): NotFoundException {
    return new NotFoundException(
      `${this.constructor.name} no entity found with: ${JSON.stringify(options)}`,
      this.notFoundStatus,
    );
  }
}
