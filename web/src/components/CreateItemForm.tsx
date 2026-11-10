import {
  type ReactNode,
  type SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { useCreateItem } from '../api/items';
import type { ItemType } from '../api/api.types';
import type { FolderIdProps } from './components.types';

export function CreateItemForm({
  folderId,
}: Readonly<FolderIdProps>): ReactNode {
  const [name, setName] = useState('');
  const [type, setType] = useState<ItemType>('folder');
  const create = useCreateItem();
  const { reset } = create;

  useEffect(() => reset(), [name, type, reset]);

  function submit(event: SyntheticEvent<HTMLFormElement>): void {
    event.preventDefault();
    create.mutate(
      { type, name, parentId: folderId },
      { onSuccess: () => setName('') },
    );
  }

  return (
    <form className="create-form" onSubmit={submit}>
      <label htmlFor="new-item-name">New</label>
      <select
        aria-label="Type"
        value={type}
        onChange={(event) => setType(event.target.value as ItemType)}
      >
        <option value="folder">Folder</option>
        <option value="file">File</option>
      </select>
      <input
        id="new-item-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Name"
      />
      <button type="submit" disabled={create.isPending || name.trim() === ''}>
        Create
      </button>
      {create.error !== null && <p role="alert">{create.error.message}</p>}
    </form>
  );
}
