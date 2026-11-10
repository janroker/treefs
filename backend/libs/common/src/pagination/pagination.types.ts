export type Page<Row> = {
  items: Array<Row>;
  nextCursor: string | null;
};

export type CursorPosition = Record<string, string>;
