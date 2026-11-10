import { type ReactNode, useState } from 'react';
import { useDeleteItem } from '../api/items';
import type { DeleteButtonProps, DeleteConfirmProps } from './components.types';
import { TrashIcon } from './Icons';

function DeleteConfirm({
  name,
  type,
  pending,
  error,
  onConfirm,
  onCancel,
}: Readonly<DeleteConfirmProps>): ReactNode {
  return (
    <span
      className="confirm"
      onKeyDown={(event) => event.key === 'Escape' && onCancel()}
    >
      <span className="confirm-text">
        Delete “
        <span className="confirm-name" title={name}>
          {name}
        </span>
        ”{type === 'folder' ? ' and everything inside' : ''}?
      </span>
      <button
        type="button"
        className="danger"
        disabled={pending}
        onClick={onConfirm}
      >
        Delete
      </button>
      <button type="button" autoFocus onClick={onCancel}>
        Cancel
      </button>
      {error !== null && <span role="alert">{error.message}</span>}
    </span>
  );
}

export function DeleteButton({
  id,
  name,
  type,
  onDeleted,
}: Readonly<DeleteButtonProps>): ReactNode {
  const [confirming, setConfirming] = useState(false);
  const [restoreFocus, setRestoreFocus] = useState(false);
  const remove = useDeleteItem(onDeleted);

  if (!confirming) {
    return (
      <button
        type="button"
        className="icon-button"
        autoFocus={restoreFocus}
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${name}`}
      >
        <TrashIcon />
      </button>
    );
  }
  return (
    <DeleteConfirm
      name={name}
      type={type}
      pending={remove.isPending}
      error={remove.error}
      onConfirm={() => remove.mutate(id)}
      onCancel={() => {
        setRestoreFocus(true);
        setConfirming(false);
      }}
    />
  );
}
