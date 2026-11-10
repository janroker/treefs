import type { MouseEvent, ReactNode } from 'react';
import { urlOfFolder } from '../hooks/useFolderUrl';
import type { FolderLinkProps } from './components.types';

function isPlainClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export function FolderLink({
  folderId,
  onOpen,
  children,
}: Readonly<FolderLinkProps>): ReactNode {
  function open(event: MouseEvent<HTMLAnchorElement>): void {
    if (isPlainClick(event)) {
      event.preventDefault();
      onOpen(folderId);
    }
  }

  return (
    <a className="link" href={urlOfFolder(folderId)} onClick={open}>
      {children}
    </a>
  );
}
