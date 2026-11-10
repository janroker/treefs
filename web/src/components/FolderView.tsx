import { type ReactNode, useEffect, useRef } from 'react';
import { useFolderItems } from '../api/items';
import type {
  FolderViewProps,
  ItemListProps,
  ItemRowProps,
} from './components.types';
import { DeleteButton } from './DeleteButton';
import { FolderLink } from './FolderLink';
import { FileIcon, FolderIcon } from './Icons';

function ItemRow({
  item,
  highlighted,
  onOpen,
}: Readonly<ItemRowProps>): ReactNode {
  const rowRef = useRef<HTMLLIElement>(null);
  const isFolder = item.type === 'folder';

  useEffect(() => {
    if (highlighted) {
      rowRef.current?.scrollIntoView({ block: 'center' });
    }
  }, [highlighted]);

  const name = (
    <span className="name" title={item.name}>
      {item.name}
    </span>
  );
  return (
    <li ref={rowRef} className={highlighted ? 'item highlighted' : 'item'}>
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

function ItemList({
  items,
  highlightedId,
  onOpen,
}: Readonly<ItemListProps>): ReactNode {
  if (items.length === 0) {
    return <p className="empty">This folder is empty.</p>;
  }
  return (
    <ul className="items">
      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          highlighted={item.id === highlightedId}
          onOpen={onOpen}
        />
      ))}
    </ul>
  );
}

export function FolderView({
  folderId,
  highlightedId,
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
  return (
    <section aria-label="Folder contents">
      <ItemList
        items={folder.data.pages.flatMap((page) => page.items)}
        highlightedId={highlightedId}
        onOpen={onOpen}
      />
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
