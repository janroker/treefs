import { itemType } from '@app/common/enums/item-type';
import { z } from 'zod';

export const itemDtoSchema = z.object({
  id: z.uuid(),
  type: z.enum(itemType),
  name: z.string(),
  parentId: z.uuid().nullable(),
  createdAt: z.iso.datetime(),
});

export type ItemDto = z.infer<typeof itemDtoSchema>;
