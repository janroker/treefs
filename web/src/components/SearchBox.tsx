import type { FocusEvent, ReactNode } from 'react';
import { useSearchForm } from '../hooks/useSearchForm';
import { useSearchQuery } from '../hooks/useSearchQuery';
import type { SearchBoxProps } from './components.types';
import { SearchField } from './SearchField';

export function SearchBox({
  folderId,
  onSelect,
}: Readonly<SearchBoxProps>): ReactNode {
  const form = useSearchForm();
  const search = useSearchQuery(form, folderId);

  function closeOnLeave(event: FocusEvent<HTMLElement>): void {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      form.setFocused(false);
    }
  }

  return (
    <section
      aria-label="Search"
      className="search"
      onFocus={() => form.setFocused(true)}
      onBlur={closeOnLeave}
    >
      <SearchField
        form={form}
        insideFolder={folderId !== null}
        search={search}
        onSelect={onSelect}
      />
      {search.error !== null && (
        <p role="alert">Search failed: {search.error.message}</p>
      )}
    </section>
  );
}
