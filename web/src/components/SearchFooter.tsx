import type { ReactNode } from 'react';
import type { SearchFooterProps } from './components.types';

export function SearchFooter({
  search,
}: Readonly<SearchFooterProps>): ReactNode {
  return (
    <>
      {search.hasMore && (
        <p className="muted popup-note">
          Showing {search.items.length}.{' '}
          <button
            type="button"
            className="text-button"
            disabled={search.loadingMore}
            onClick={search.loadMore}
          >
            Show more
          </button>
        </p>
      )}
      {search.stale && (
        <p className="searching muted popup-note" role="status">
          Searching…
        </p>
      )}
    </>
  );
}
