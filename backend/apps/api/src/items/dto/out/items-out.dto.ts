import { itemDtoSchema } from '@app/dto/item';
import { z } from 'zod';

export const itemWithPathDtoSchema = itemDtoSchema.extend({ path: z.string() });

export type ItemWithPathDto = z.infer<typeof itemWithPathDtoSchema>;

export const ancestorDtoSchema = itemDtoSchema.pick({ id: true, name: true });

export const itemDetailDtoSchema = itemWithPathDtoSchema.extend({
  ancestors: z.array(ancestorDtoSchema),
});

export type AncestorDto = z.infer<typeof ancestorDtoSchema>;

export type ItemDetailDto = z.infer<typeof itemDetailDtoSchema>;

export const itemPageDtoSchema = z.object({
  items: z.array(itemWithPathDtoSchema),
  nextCursor: z.string().nullable(),
});

export type ItemPageDto = z.infer<typeof itemPageDtoSchema>;
