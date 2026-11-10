import type { ReactNode } from 'react';
import { useItemDetail } from '../api/items';
import type {
  BreadcrumbsProps,
  CrumbMenuProps,
  CrumbProps,
} from './components.types';
import { FolderLink } from './FolderLink';

const HEAD_CRUMBS = 1;
const TAIL_CRUMBS = 2;
const COLLAPSE_FROM = HEAD_CRUMBS + TAIL_CRUMBS + 2;

function Crumb({ crumb, onOpen }: Readonly<CrumbProps>): ReactNode {
  return (
    <li>
      <FolderLink folderId={crumb.id} onOpen={onOpen}>
        {crumb.name}
      </FolderLink>
    </li>
  );
}

function CrumbMenu({ crumbs, onOpen }: Readonly<CrumbMenuProps>): ReactNode {
  return (
    <li>
      <details className="crumb-menu">
        <summary aria-label={`Show ${String(crumbs.length)} hidden folders`}>
          …
        </summary>
        <ul>
          {crumbs.map((crumb) => (
            <Crumb key={crumb.id} crumb={crumb} onOpen={onOpen} />
          ))}
        </ul>
      </details>
    </li>
  );
}

export function Breadcrumbs({
  folderId,
  onOpen,
}: Readonly<BreadcrumbsProps>): ReactNode {
  const { data: folder } = useItemDetail(folderId);
  const trail =
    folder === undefined
      ? []
      : [...folder.ancestors, { id: folder.id, name: folder.name }];
  const collapsed = trail.length >= COLLAPSE_FROM;
  const head = collapsed ? trail.slice(0, HEAD_CRUMBS) : trail;
  const hidden = collapsed ? trail.slice(HEAD_CRUMBS, -TAIL_CRUMBS) : [];
  const tail = collapsed ? trail.slice(-TAIL_CRUMBS) : [];

  return (
    <nav aria-label="Breadcrumbs">
      <ol className="breadcrumbs">
        <Crumb crumb={{ id: null, name: 'All files' }} onOpen={onOpen} />
        {head.map((crumb) => (
          <Crumb key={crumb.id} crumb={crumb} onOpen={onOpen} />
        ))}
        {hidden.length > 0 && <CrumbMenu crumbs={hidden} onOpen={onOpen} />}
        {tail.map((crumb) => (
          <Crumb key={crumb.id} crumb={crumb} onOpen={onOpen} />
        ))}
      </ol>
    </nav>
  );
}
