import { type JSX, useState } from 'react';
import { useSearch } from '../api/items';
import type { MatchMode } from '../api/api.types';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import type {
  OpenFolderProps,
  SearchOptionsProps,
  SearchResultsProps,
  TypeFilter,
} from './components.types';

const DEBOUNCE_MS = 150;

function SearchResults({
  items,
  onOpen,
}: Readonly<SearchResultsProps>): JSX.Element {
  if (items.length === 0) {
    return <p>No matches.</p>;
  }
  return (
    <ul className="items" aria-label="Search results">
      {items.map((item) => (
        <li key={item.id} className="item">
          <span className="kind">
            {item.type === 'folder' ? 'Folder' : 'File'}
          </span>
          <button
            type="button"
            className="link"
            onClick={() =>
              onOpen(item.type === 'folder' ? item.id : item.parentId)
            }
          >
            {item.path}
          </button>
        </li>
      ))}
    </ul>
  );
}

function SearchOptions({
  typeFilter,
  onTypeFilter,
  match,
  onMatch,
}: Readonly<SearchOptionsProps>): JSX.Element {
  return (
    <>
      <select
        aria-label="Search for"
        value={typeFilter}
        onChange={(event) => onTypeFilter(event.target.value as TypeFilter)}
      >
        <option value="file">Files</option>
        <option value="folder">Folders</option>
        <option value="both">Files and folders</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={match === 'exact'}
          onChange={(event) =>
            onMatch(event.target.checked ? 'exact' : 'prefix')
          }
        />{' '}
        Exact name
      </label>
    </>
  );
}

export function SearchBox({ onOpen }: Readonly<OpenFolderProps>): JSX.Element {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const [match, setMatch] = useState<MatchMode>('prefix');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('file');
  const q = useDebouncedValue(text, DEBOUNCE_MS);
  const enabled = match === 'prefix' ? focused || q !== '' : q !== '';
  const search = useSearch(
    { q, match, type: typeFilter === 'both' ? undefined : typeFilter },
    enabled,
  );

  return (
    <section aria-label="Search" className="search">
      <div className="create">
        <input
          aria-label="Search by name"
          placeholder={
            match === 'prefix' ? 'Name starts with...' : 'Exact name'
          }
          value={text}
          onChange={(event) => setText(event.target.value)}
          onFocus={() => setFocused(true)}
        />
        <SearchOptions
          typeFilter={typeFilter}
          onTypeFilter={setTypeFilter}
          match={match}
          onMatch={setMatch}
        />
      </div>
      {search.isError && (
        <p role="alert">Search failed: {search.error.message}</p>
      )}
      {enabled && search.data !== undefined && (
        <SearchResults items={search.data.items} onOpen={onOpen} />
      )}
    </section>
  );
}
