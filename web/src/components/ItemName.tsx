import type { ReactNode } from 'react';
import type { ItemNameProps } from './components.types';

const TAIL_LENGTH = 16;
const SPLIT_FROM_LENGTH = 32;

export function ItemName({ name }: Readonly<ItemNameProps>): ReactNode {
  if (name.length <= SPLIT_FROM_LENGTH) {
    return (
      <span className="name" title={name}>
        {name}
      </span>
    );
  }
  return (
    <span className="name split" title={name}>
      <span className="name-start">{name.slice(0, -TAIL_LENGTH)}</span>
      <span className="name-end">{name.slice(-TAIL_LENGTH)}</span>
    </span>
  );
}
