import { type SyntheticEvent, useEffect, useState } from 'react';
import { useCreateItem } from '../api/items';
import { nameProblem } from '../api/name-rules';
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

  const problem = nameProblem(name);

  return {
    name,
    setName,
    submit,
    canSubmit: !create.isPending && name.trim() !== '' && problem === null,
    message: problem ?? create.error?.message ?? null,
  };
}
