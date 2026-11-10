import type { z } from 'zod';
import { BadRequestException } from '../errors/exceptions';
import { exceptionStatus } from '../errors/exception-status';
import type { CursorPosition } from './pagination.types';

function parseCursorJson(cursor: string): unknown {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
  } catch {
    return undefined;
  }
}

export function encodeCursor(position: CursorPosition): string {
  return Buffer.from(JSON.stringify(position)).toString('base64url');
}

export function decodeCursor<T>(
  cursor: string | null,
  schema: z.ZodType<T>,
): T | null {
  if (cursor === null) {
    return null;
  }
  const result = schema.safeParse(parseCursorJson(cursor));
  if (!result.success) {
    throw new BadRequestException(
      'The cursor is not valid for this query',
      exceptionStatus.INVALID_CURSOR,
    );
  }
  return result.data;
}
