import type { ReactNode } from 'react';
import { useItemDetail } from '../api/items';
import type { BreadcrumbsProps } from './components.types';
import { FolderLink } from './FolderLink';

export function Breadcrumbs({
  folderId,
  onOpen,
}: Readonly<BreadcrumbsProps>): ReactNode {
  const { data: folder } = useItemDetail(folderId);
  const trail =
    folder === undefined
      ? []
      : [...folder.ancestors, { id: folder.id, name: folder.name }];

  return (
    <nav aria-label="Breadcrumbs">
      <ol className="breadcrumbs">
        <li>
          <FolderLink folderId={null} onOpen={onOpen}>
            All files
          </FolderLink>
        </li>
        {trail.map((crumb) => (
          <li key={crumb.id}>
            <FolderLink folderId={crumb.id} onOpen={onOpen}>
              {crumb.name}
            </FolderLink>
          </li>
        ))}
      </ol>
    </nav>
  );
}
