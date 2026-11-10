import { MAX_ITEM_NAME_BYTES } from '@app/common/constants';
import { z } from 'zod';

const utf8 = new TextEncoder();

const forbiddenCharacters =
  /[/\\\p{Cc}\u202A-\u202E\u2066-\u2069\p{Noncharacter_Code_Point}]/u;

export const itemNameSchema = z
  .string()
  .transform((value) => value.normalize('NFC'))
  .refine((value) => value.length > 0, 'Name must not be empty')
  .refine(
    (value) => utf8.encode(value).length <= MAX_ITEM_NAME_BYTES,
    `Name must be at most ${String(MAX_ITEM_NAME_BYTES)} bytes`,
  )
  .refine(
    (value) => value === value.trim(),
    'Name must not start or end with whitespace',
  )
  .refine(
    (value) => value !== '.' && value !== '..',
    'Name must not be "." or ".."',
  )
  .refine(
    (value) => !forbiddenCharacters.test(value),
    'Name must not contain / \\ or control characters',
  );

export const searchTextSchema = z
  .string()
  .max(MAX_ITEM_NAME_BYTES)
  .transform((value) => value.normalize('NFC'))
  .refine(
    (value) => !forbiddenCharacters.test(value),
    'Search text contains a character that is not allowed',
  );
