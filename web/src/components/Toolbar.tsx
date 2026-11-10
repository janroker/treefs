import type { ReactNode } from 'react';
import { MAX_ITEM_DEPTH } from '../api/limits';
import { useItemDetail } from '../api/items';
import { Breadcrumbs } from './Breadcrumbs';
import type { ToolbarProps } from './components.types';
import { NewItemButtons } from './NewItemButtons';

export function Toolbar({
  folderId,
  onOpen,
  onCreate,
}: Readonly<ToolbarProps>): ReactNode {
  const { data: folder } = useItemDetail(folderId);
  const atMaxDepth =
    folder !== undefined && folder.ancestors.length >= MAX_ITEM_DEPTH;

  return (
    <div className="toolbar">
      <Breadcrumbs folderId={folderId} onOpen={onOpen} />
      <NewItemButtons
        disabledReason={
          atMaxDepth
            ? `Maximum depth (${String(MAX_ITEM_DEPTH)}) reached`
            : null
        }
        onCreate={onCreate}
      />
    </div>
  );
}
