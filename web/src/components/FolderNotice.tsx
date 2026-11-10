import type { ReactNode } from 'react';
import type { FolderNoticeProps } from './components.types';

export function FolderNotice({
  filterName,
  locateName,
  onShowOnly,
  onClearFilter,
}: Readonly<FolderNoticeProps>): ReactNode {
  if (filterName !== null) {
    return (
      <p className="notice" role="status">
        Showing only “{filterName}”.{' '}
        <button type="button" className="text-button" onClick={onClearFilter}>
          Show all items
        </button>
      </p>
    );
  }
  if (locateName === null) {
    return null;
  }
  return (
    <p className="notice" role="status">
      “{locateName}” is further down in this folder.{' '}
      <button
        type="button"
        className="text-button"
        onClick={() => onShowOnly(locateName)}
      >
        Show it
      </button>
    </p>
  );
}
