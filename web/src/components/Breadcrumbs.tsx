import type { JSX } from 'react';
import { useItemDetail } from '../api/items';
import type { BreadcrumbsProps } from './components.types';

export function Breadcrumbs({
  folderId,
  onOpen,
}: Readonly<BreadcrumbsProps>): JSX.Element {
  const { data: folder } = useItemDetail(folderId);
  const trail =
    folder === undefined
      ? []
      : [...folder.ancestors, { id: folder.id, name: folder.name }];

  return (
    <nav aria-label="Breadcrumbs" className="breadcrumbs">
      <button type="button" className="link" onClick={() => onOpen(null)}>
        All files
      </button>
      {trail.map((crumb) => (
        <span key={crumb.id}>
          {' / '}
          <button
            type="button"
            className="link"
            onClick={() => onOpen(crumb.id)}
          >
            {crumb.name}
          </button>
        </span>
      ))}
    </nav>
  );
}
