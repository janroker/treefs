import type { InsertResult } from 'typeorm';
import { z } from 'zod';

const identifierSchema = z.object({ id: z.string() });

export function getInsertedId(result: InsertResult): string {
  return identifierSchema.parse(result.identifiers[0]).id;
}

export function getInsertedIds(result: InsertResult): Array<string> {
  return result.identifiers.map(
    (identifier) => identifierSchema.parse(identifier).id,
  );
}
