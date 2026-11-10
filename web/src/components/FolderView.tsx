import type { JSX } from 'react';
import { useFolderItems } from '../api/items';
import type { FolderViewProps, ItemRowProps } from './components.types';
import { DeleteButton } from './DeleteButton';

function ItemRow({ item, onOpen }: Readonly<ItemRowProps>): JSX.Element {
  const isFolder = item.type === 'folder';
  return (
    <li className="item">
      <span className="kind">{isFolder ? 'Folder' : 'File'}</span>
      {isFolder ? (
        <button type="button" className="link" onClick={() => onOpen(item.id)}>
          {item.name}
        </button>
      ) : (
        <span>{item.name}</span>
      )}
      <DeleteButton id={item.id} name={item.name} />
    </li>
  );
}

export function FolderView({
  folderId,
  onOpen,
}: Readonly<FolderViewProps>): JSX.Element {
  const folder = useFolderItems(folderId);

  if (folder.isPending) {
    return <p>Loading...</p>;
  }
  if (folder.isError) {
    return (
      <p role="alert">Could not load this folder: {folder.error.message}</p>
    );
  }
  const items = folder.data.pages.flatMap((page) => page.items);
  return (
    <section aria-label="Folder contents">
      {items.length === 0 ? <p>This folder is empty.</p> : null}
      <ul className="items">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} onOpen={onOpen} />
        ))}
      </ul>
      {folder.hasNextPage ? (
        <button
          type="button"
          disabled={folder.isFetchingNextPage}
          onClick={() => void folder.fetchNextPage()}
        >
          Load more
        </button>
      ) : null}
    </section>
  );
}
