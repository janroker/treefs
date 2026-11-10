import { type ReactNode, useState } from 'react';
import { useDeleteItem } from '../api/items';
import type { DeleteButtonProps } from './components.types';

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
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${name}`}
      >
        Delete
      </button>
    );
  }
  return (
    <span className="confirm">
      <button
        type="button"
        className="danger"
        disabled={remove.isPending}
        onClick={() => remove.mutate(id)}
      >
        Delete {name} and everything in it
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
