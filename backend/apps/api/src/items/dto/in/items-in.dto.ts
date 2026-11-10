import { itemDtoSchema } from '@app/dto/item';
import { z } from 'zod';
import { itemNameSchema } from '../../schemas';
import { MAX_PAGE_SIZE, ROOT } from '../../constants';

export const createItemSchema = z.strictObject(
  itemDtoSchema
    .pick({ type: true, parentId: true })
    .extend({ name: itemNameSchema }).shape,
);

export type CreateItemDto = z.infer<typeof createItemSchema>;

export const itemIdSchema = itemDtoSchema.shape.id;

export type ItemIdDto = z.infer<typeof itemIdSchema>;

export const listItemsQuerySchema = z.strictObject({
  parentId: z.union([z.literal(ROOT), itemDtoSchema.shape.id]),
  type: itemDtoSchema.shape.type.optional(),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).optional(),
  cursor: z.string().min(1).max(512).optional(),
});

export type ListItemsQueryDto = z.infer<typeof listItemsQuerySchema>;
