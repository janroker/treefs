import type { ReactNode } from 'react';
import { useFolderItems } from '../api/items';
import type { FolderViewProps, ItemRowProps } from './components.types';
import { DeleteButton } from './DeleteButton';
import { FolderLink } from './FolderLink';
import { FileIcon, FolderIcon } from './Icons';

function ItemRow({ item, onOpen }: Readonly<ItemRowProps>): ReactNode {
  const isFolder = item.type === 'folder';
  const name = (
    <span className="name" title={item.name}>
      {item.name}
    </span>
  );
  return (
    <li className="item">
      {isFolder ? <FolderIcon /> : <FileIcon />}
      {isFolder ? (
        <FolderLink folderId={item.id} onOpen={onOpen}>
          {name}
        </FolderLink>
      ) : (
        name
      )}
      <DeleteButton id={item.id} name={item.name} />
    </li>
  );
}

export function FolderView({
  folderId,
  onOpen,
}: Readonly<FolderViewProps>): ReactNode {
  const folder = useFolderItems(folderId);

  if (folder.isPending) {
    return <p className="muted">Loading...</p>;
  }
  if (folder.isError) {
    return (
      <p role="alert">Could not load this folder: {folder.error.message}</p>
    );
  }
  const items = folder.data.pages.flatMap((page) => page.items);
  return (
    <section aria-label="Folder contents">
      {items.length === 0 ? (
        <p className="empty">This folder is empty.</p>
      ) : (
        <ul className="items">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} onOpen={onOpen} />
          ))}
        </ul>
      )}
      {folder.hasNextPage ? (
        <button
          type="button"
          className="load-more"
          disabled={folder.isFetchingNextPage}
          onClick={() => void folder.fetchNextPage()}
        >
          Load more
        </button>
      ) : null}
    </section>
  );
}
