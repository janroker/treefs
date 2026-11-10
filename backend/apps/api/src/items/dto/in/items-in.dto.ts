import { itemDtoSchema } from '@app/dto/item';
import { z } from 'zod';
import { itemNameSchema, searchTextSchema } from '../../schemas';
import { matchMode } from '../../enums';
import { MAX_PAGE_SIZE, ROOT } from '../../constants';

export const createItemSchema = z.strictObject(
  itemDtoSchema
    .pick({ type: true, parentId: true })
    .extend({ name: itemNameSchema }).shape,
);

export type CreateItemDto = z.infer<typeof createItemSchema>;

export const itemIdSchema = itemDtoSchema.shape.id;

export type ItemIdDto = z.infer<typeof itemIdSchema>;

export const listItemsQuerySchema = z
  .strictObject({
    q: searchTextSchema.optional(),
    match: z.enum(matchMode).default(matchMode.PREFIX),
    type: itemDtoSchema.shape.type.optional(),
    parentId: z.union([z.literal(ROOT), itemDtoSchema.shape.id]).optional(),
    limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).optional(),
    cursor: z.string().min(1).max(512).optional(),
  })
  .refine((query) => query.q !== undefined || query.parentId !== undefined, {
    message: 'Provide q to search or parentId to list a folder',
    path: ['q'],
  })
  .refine(
    (query) => query.match !== matchMode.EXACT || (query.q?.length ?? 0) > 0,
    {
      message: 'Exact search needs a non-empty q',
      path: ['q'],
    },
  );

export type ListItemsQueryDto = z.infer<typeof listItemsQuerySchema>;
