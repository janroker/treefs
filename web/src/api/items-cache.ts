import type { InfiniteData } from '@tanstack/react-query';
import type { Item, ItemPage } from './api.types';

type FolderPages = InfiniteData<ItemPage>;

function nameKeyOf(name: string): string {
  return name.normalize('NFC').toLowerCase();
}

function insertSorted(items: Array<Item>, item: Item): Array<Item> {
  const key = nameKeyOf(item.name);
  const position = items.findIndex(
    (existing) => nameKeyOf(existing.name) > key,
  );
  if (position === -1) {
    return [...items, item];
  }
  return [...items.slice(0, position), item, ...items.slice(position)];
}

function pageIndexFor(pages: FolderPages['pages'], item: Item): number {
  const key = nameKeyOf(item.name);
  const covering = pages.findIndex((page) => {
    const last = page.items.at(-1);
    return last !== undefined && nameKeyOf(last.name) >= key;
  });
  if (covering !== -1) {
    return covering;
  }
  const lastIndex = pages.length - 1;
  return pages[lastIndex]?.nextCursor === null ? lastIndex : -1;
}

export function withItem(data: FolderPages, item: Item): FolderPages {
  const pageIndex = pageIndexFor(data.pages, item);
  if (pageIndex === -1) {
    return data;
  }
  return {
    ...data,
    pages: data.pages.map((page, index) =>
      index === pageIndex
        ? { ...page, items: insertSorted(page.items, item) }
        : page,
    ),
  };
}

export function withoutItem(data: FolderPages, id: string): FolderPages {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.filter((item) => item.id !== id),
    })),
  };
}
