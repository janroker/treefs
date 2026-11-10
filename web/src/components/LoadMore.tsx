import type { ReactNode } from 'react';
import type { Item } from '../api/api.types';
import type { LoadMoreProps } from './components.types';

async function loadMore(
  folder: LoadMoreProps['folder'],
  onFocusItem: (item: Item) => void,
): Promise<void> {
  const result = await folder.fetchNextPage();
  const firstNew = result.data?.pages.at(-1)?.items[0];
  if (firstNew !== undefined) {
    onFocusItem(firstNew);
  }
}

export function LoadMore({
  folder,
  itemCount,
  onFocusItem,
}: Readonly<LoadMoreProps>): ReactNode {
  if (!folder.hasNextPage) {
    return null;
  }
  return (
    <div className="load-more">
      <span className="muted">Showing {itemCount.toLocaleString()}+</span>
      <button
        type="button"
        disabled={folder.isFetchingNextPage}
        onClick={() => void loadMore(folder, onFocusItem)}
      >
        Load more
      </button>
    </div>
  );
}
