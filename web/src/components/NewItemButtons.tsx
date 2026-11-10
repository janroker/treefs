import type { ReactNode } from 'react';
import type { NewItemButtonsProps } from './components.types';

export function NewItemButtons({
  disabledReason,
  onCreate,
}: Readonly<NewItemButtonsProps>): ReactNode {
  return (
    <div className="actions">
      <button
        type="button"
        disabled={disabledReason !== null}
        title={disabledReason ?? undefined}
        onClick={() => onCreate('folder')}
      >
        + New folder
      </button>
      <button
        type="button"
        disabled={disabledReason !== null}
        title={disabledReason ?? undefined}
        onClick={() => onCreate('file')}
      >
        + New file
      </button>
    </div>
  );
}
