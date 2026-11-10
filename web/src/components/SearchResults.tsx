import type { ReactNode } from 'react';
import type {
  MatchedNameProps,
  SearchResultRowProps,
  SearchResultsProps,
} from './components.types';
import { FileIcon, FolderIcon } from './Icons';

const PATH_SEPARATOR = ' › ';

function folderPathOf(path: string): string {
  const parents = path.split('/').slice(1, -1);
  return ['All files', ...parents].join(PATH_SEPARATOR);
}

function MatchedName({
  name,
  query,
  match,
}: Readonly<MatchedNameProps>): ReactNode {
  const matchedLength =
    match === 'prefix' && name.toLowerCase().startsWith(query.toLowerCase())
      ? query.length
      : 0;
  return (
    <span className="name">
      <strong>{name.slice(0, matchedLength)}</strong>
      {name.slice(matchedLength)}
    </span>
  );
}

function SearchResultRow({
  item,
  id,
  query,
  match,
  active,
  onChoose,
}: Readonly<SearchResultRowProps>): ReactNode {
  return (
    <li
      id={id}
      role="option"
      aria-selected={active}
      className="result"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onChoose}
    >
      {item.type === 'folder' ? <FolderIcon /> : <FileIcon />}
      <span className="result-text">
        <MatchedName name={item.name} query={query} match={match} />
        <span className="muted name">{folderPathOf(item.path)}</span>
      </span>
    </li>
  );
}

export function SearchResults({
  items,
  listId,
  activeIndex,
  onChoose,
  ...rowProps
}: Readonly<SearchResultsProps>): ReactNode {
  if (items.length === 0) {
    return (
      <p className="muted popup-note" aria-live="polite">
        No matches.
      </p>
    );
  }
  return (
    <ul id={listId} role="listbox" aria-label="Search results">
      {items.map((item, index) => (
        <SearchResultRow
          key={item.id}
          item={item}
          id={`${listId}-${String(index)}`}
          active={index === activeIndex}
          onChoose={() => onChoose(index)}
          {...rowProps}
        />
      ))}
    </ul>
  );
}
