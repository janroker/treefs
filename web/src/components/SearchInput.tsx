import type { ReactNode } from 'react';
import type { SearchInputProps } from './components.types';

export function SearchInput({
  form,
  open,
  listId,
  activeId,
  onKeyDown,
}: Readonly<SearchInputProps>): ReactNode {
  return (
    <input
      role="combobox"
      aria-label="Search by name"
      aria-autocomplete="list"
      aria-expanded={open}
      aria-controls={listId}
      aria-activedescendant={activeId}
      placeholder={
        form.match === 'prefix' ? 'Name starts with...' : 'Exact name'
      }
      value={form.text}
      onChange={(event) => form.setText(event.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}
