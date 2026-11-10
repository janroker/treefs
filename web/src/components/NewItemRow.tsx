import { type ReactNode, useRef } from 'react';
import { useNewItem } from '../hooks/useNewItem';
import type { NewItemRowProps } from './components.types';
import { FileIcon, FolderIcon } from './Icons';

export function NewItemRow(props: Readonly<NewItemRowProps>): ReactNode {
  const { type, onCancel } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useNewItem({ ...props, inputRef });

  return (
    <li className="item new-item">
      {type === 'folder' ? <FolderIcon /> : <FileIcon />}
      <form
        onSubmit={form.submit}
        onKeyDown={(event) => event.key === 'Escape' && onCancel()}
      >
        <input
          ref={inputRef}
          autoFocus
          aria-label={`New ${type} name`}
          placeholder={type === 'folder' ? 'Folder name' : 'File name'}
          value={form.name}
          onChange={(event) => form.setName(event.target.value)}
        />
        <button type="submit" className="primary" disabled={!form.canSubmit}>
          Create
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
      {form.message !== null && (
        <p role="alert" className="item-error">
          {form.message}
        </p>
      )}
    </li>
  );
}
