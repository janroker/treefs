import { type SyntheticEvent, useEffect, useState } from 'react';
import { useCreateItem } from '../api/items';
import type { NewItemForm, NewItemFormConfig } from './hooks.types';

export function useNewItem({
  type,
  folderId,
  inputRef,
  onCreated,
}: NewItemFormConfig): NewItemForm {
  const [name, setName] = useState('');
  const create = useCreateItem();
  const { reset, isError } = create;

  useEffect(() => reset(), [name, reset]);

  useEffect(() => {
    if (isError) {
      inputRef.current?.select();
    }
  }, [isError, inputRef]);

  function submit(event: SyntheticEvent<HTMLFormElement>): void {
    event.preventDefault();
    create.mutate({ type, name, parentId: folderId }, { onSuccess: onCreated });
  }

  return {
    name,
    setName,
    submit,
    isPending: create.isPending,
    error: create.error,
  };
}
