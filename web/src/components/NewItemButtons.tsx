import type { ReactNode } from 'react';
import type { NewItemButtonsProps } from './components.types';

export function NewItemButtons({
  onCreate,
}: Readonly<NewItemButtonsProps>): ReactNode {
  return (
    <div className="actions">
      <button type="button" onClick={() => onCreate('folder')}>
        + New folder
      </button>
      <button type="button" onClick={() => onCreate('file')}>
        + New file
      </button>
    </div>
  );
}
