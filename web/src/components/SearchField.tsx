import { type ReactNode, useRef } from 'react';
import { useSearchNavigation } from '../hooks/useSearchNavigation';
import type { SearchFieldProps } from './components.types';
import { SearchInput } from './SearchInput';
import { SearchPopup } from './SearchPopup';

export function SearchField({
  form,
  insideFolder,
  search,
  onSelect,
}: Readonly<SearchFieldProps>): ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigation = useSearchNavigation({
    items: search.items,
    locked: search.stale,
    resetKey: form.text,
    onSelect,
    onDismiss: form.dismiss,
  });

  return (
    <div className="search-field">
      <SearchInput
        form={form}
        open={search.open}
        listId={navigation.listId}
        activeId={navigation.activeId}
        inputRef={inputRef}
        onKeyDown={navigation.onKeyDown}
      />
      {search.open && (
        <SearchPopup
          form={form}
          insideFolder={insideFolder}
          search={search}
          navigation={navigation}
          onWiden={() => {
            form.setScope('everywhere');
            inputRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}
