import { encodeCursor } from './cursor';
import type { CursorPosition, Page } from './pagination.types';

export function toPage<Row>(
  rows: ReadonlyArray<Row>,
  limit: number,
  cursorOf: (last: Row) => CursorPosition,
): Page<Row> {
  const items = rows.slice(0, limit);
  const last = items.at(-1);
  const hasMore = rows.length > limit && last !== undefined;
  return { items, nextCursor: hasMore ? encodeCursor(cursorOf(last)) : null };
}
