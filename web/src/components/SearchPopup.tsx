import type { ReactNode } from 'react';
import type { SearchPopupProps } from './components.types';
import { SearchOptions } from './SearchOptions';
import { SearchResults } from './SearchResults';

export function SearchPopup({
  form,
  insideFolder,
  search,
  navigation,
  onWiden,
}: Readonly<SearchPopupProps>): ReactNode {
  const canWiden = insideFolder && form.scope === 'folder';

  return (
    <div className="popup">
      <SearchOptions form={form} insideFolder={insideFolder} />
      {search.showResults && (
        <SearchResults
          items={search.items}
          query={search.query}
          match={form.match}
          listId={navigation.listId}
          activeIndex={navigation.activeIndex}
          onChoose={navigation.choose}
          onWiden={canWiden ? onWiden : null}
        />
      )}
    </div>
  );
}
