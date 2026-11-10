import type { FocusEvent, ReactNode } from 'react';
import { useSearchForm } from '../hooks/useSearchForm';
import { useSearchQuery } from '../hooks/useSearchQuery';
import type { SearchBoxProps } from './components.types';
import { SearchField } from './SearchField';
import { SearchOptions } from './SearchOptions';

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
      <SearchField form={form} search={search} onSelect={onSelect} />
      <SearchOptions
        insideFolder={folderId !== null}
        scope={form.scope}
        onScope={form.setScope}
        typeFilter={form.typeFilter}
        onTypeFilter={form.setTypeFilter}
        match={form.match}
        onMatch={form.setMatch}
      />
      {search.error !== null && (
        <p role="alert">Search failed: {search.error.message}</p>
      )}
    </section>
  );
}
