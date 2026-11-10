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
  form,
  insideFolder,
}: Readonly<SearchOptionsProps>): ReactNode {
  return (
    <div className="filters">
      {insideFolder && (
        <ScopeSelect scope={form.scope} onScope={form.setScope} />
      )}
      <select
        aria-label="Search for"
        value={form.typeFilter}
        onChange={(event) =>
          form.setTypeFilter(event.target.value as TypeFilter)
        }
      >
        <option value="file">Files</option>
        <option value="folder">Folders</option>
        <option value="both">Files and folders</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={form.match === 'exact'}
          onChange={(event) =>
            form.setMatch(event.target.checked ? 'exact' : 'prefix')
          }
        />
        Exact name
      </label>
    </div>
  );
}
