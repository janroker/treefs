import { z } from 'zod';

export const fieldErrorDtoSchema = z.object({
  path: z.string(),
  message: z.string(),
});

export const errorDtoSchema = z.object({
  code: z.string(),
  message: z.string(),
  statusCode: z.number().int(),
  correlationId: z.string(),
  errors: z.array(fieldErrorDtoSchema).optional(),
});

export type FieldErrorDto = z.infer<typeof fieldErrorDtoSchema>;

export type ErrorDto = z.infer<typeof errorDtoSchema>;
