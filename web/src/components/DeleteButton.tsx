import { type ReactNode, useState } from 'react';
import { useDeleteItem } from '../api/items';
import type { DeleteButtonProps } from './components.types';
import { TrashIcon } from './Icons';

export function DeleteButton({
  id,
  name,
}: Readonly<DeleteButtonProps>): ReactNode {
  const [confirming, setConfirming] = useState(false);
  const remove = useDeleteItem();

  if (!confirming) {
    return (
      <button
        type="button"
        className="icon-button"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${name}`}
      >
        <TrashIcon />
      </button>
    );
  }
  return (
    <span className="confirm">
      <span>Delete everything inside?</span>
      <button
        type="button"
        className="danger"
        disabled={remove.isPending}
        onClick={() => remove.mutate(id)}
      >
        Delete
      </button>
      <button type="button" onClick={() => setConfirming(false)}>
        Cancel
      </button>
      {remove.error !== null && (
        <span role="alert">{remove.error.message}</span>
      )}
    </span>
  );
}
