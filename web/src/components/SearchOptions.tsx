import type { ReactNode } from 'react';
import type {
  ScopeSelectProps,
  SearchOptionsProps,
  SearchScope,
  TypeFilter,
} from './components.types';

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

export function SearchOptions({
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
