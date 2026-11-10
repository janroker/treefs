import type { ReactNode } from 'react';
import { useSearchNavigation } from '../hooks/useSearchNavigation';
import type { SearchFieldProps } from './components.types';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';

export function SearchField({
  form,
  search,
  onSelect,
}: Readonly<SearchFieldProps>): ReactNode {
  const { items, query, open } = search;
  const navigation = useSearchNavigation({
    items,
    onSelect,
    onDismiss: form.dismiss,
  });

  return (
    <div className="search-field">
      <SearchInput
        form={form}
        open={open}
        listId={navigation.listId}
        activeId={navigation.activeId}
        onKeyDown={navigation.onKeyDown}
      />
      {open && (
        <div className="popup">
          <SearchResults
            items={items}
            query={query}
            match={form.match}
            listId={navigation.listId}
            activeIndex={navigation.activeIndex}
            onChoose={navigation.choose}
          />
        </div>
      )}
    </div>
  );
}
