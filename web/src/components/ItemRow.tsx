import { type ReactNode, useRef } from 'react';
import { useRowFocus } from '../hooks/useRowFocus';
import type { ItemRowProps } from './components.types';
import { DeleteButton } from './DeleteButton';
import { FolderLink } from './FolderLink';
import { FileIcon, FolderIcon } from './Icons';

export function ItemRow({
  item,
  focus,
  onOpen,
  onDeleted,
}: Readonly<ItemRowProps>): ReactNode {
  const rowRef = useRef<HTMLLIElement>(null);
  const flash = useRowFocus(rowRef, focus, item.id);
  const name = (
    <span className="name" title={item.name}>
      {item.name}
    </span>
  );

  return (
    <li
      ref={rowRef}
      tabIndex={-1}
      className={flash ? 'item highlighted' : 'item'}
    >
      {item.type === 'folder' ? <FolderIcon /> : <FileIcon />}
      {item.type === 'folder' ? (
        <FolderLink folderId={item.id} onOpen={onOpen}>
          {name}
        </FolderLink>
      ) : (
        name
      )}
      <DeleteButton
        id={item.id}
        name={item.name}
        type={item.type}
        onDeleted={onDeleted}
      />
    </li>
  );
}
