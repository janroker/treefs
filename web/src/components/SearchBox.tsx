import type { ReactNode } from 'react';
import { useSearchForm } from '../hooks/useSearchForm';
import { useSearchQuery } from '../hooks/useSearchQuery';
import type {
  SearchBoxProps,
  SearchOptionsProps,
  ScopeSelectProps,
  SearchResultsProps,
  SearchScope,
  TypeFilter,
} from './components.types';
import { FolderLink } from './FolderLink';
import { FileIcon, FolderIcon } from './Icons';

function SearchResults({
  items,
  onOpen,
}: Readonly<SearchResultsProps>): ReactNode {
  if (items.length === 0) {
    return <p className="muted">No matches.</p>;
  }
  return (
    <ul className="items search-results" aria-label="Search results">
      {items.map((item) => (
        <li key={item.id} className="item">
          {item.type === 'folder' ? <FolderIcon /> : <FileIcon />}
          <FolderLink
            folderId={item.type === 'folder' ? item.id : item.parentId}
            onOpen={onOpen}
          >
            <span className="name">{item.path}</span>
          </FolderLink>
        </li>
      ))}
    </ul>
  );
}

function ScopeSelect({
  scope,
  onScope,
}: Readonly<ScopeSelectProps>): ReactNode {
  return (
    <select
      aria-label="Search in"
      value={scope}
      onChange={(event) => onScope(event.target.value as SearchScope)}
    >
      <option value="folder">This folder</option>
      <option value="everywhere">Everywhere</option>
    </select>
  );
}

function SearchOptions({
  insideFolder,
  scope,
  onScope,
  typeFilter,
  onTypeFilter,
  match,
  onMatch,
}: Readonly<SearchOptionsProps>): ReactNode {
  return (
    <>
      {insideFolder && <ScopeSelect scope={scope} onScope={onScope} />}
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
        />
        Exact name
      </label>
    </>
  );
}

export function SearchBox({
  folderId,
  onOpen,
}: Readonly<SearchBoxProps>): ReactNode {
  const form = useSearchForm();
  const { enabled, result } = useSearchQuery(form, folderId);

  return (
    <section aria-label="Search" className="search">
      <div className="search-bar">
        <input
          aria-label="Search by name"
          placeholder={
            form.match === 'prefix' ? 'Name starts with...' : 'Exact name'
          }
          value={form.text}
          onChange={(event) => form.setText(event.target.value)}
          onFocus={() => form.setFocused(true)}
        />
        <SearchOptions
          insideFolder={folderId !== null}
          scope={form.scope}
          onScope={form.setScope}
          typeFilter={form.typeFilter}
          onTypeFilter={form.setTypeFilter}
          match={form.match}
          onMatch={form.setMatch}
        />
      </div>
      {result.isError && (
        <p role="alert">Search failed: {result.error.message}</p>
      )}
      {enabled && result.data !== undefined && (
        <SearchResults items={result.data.items} onOpen={onOpen} />
      )}
    </section>
  );
}
