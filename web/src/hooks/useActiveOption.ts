import { type KeyboardEvent, useState } from 'react';
import type { ActiveOption, ActiveOptionConfig } from './hooks.types';

const NONE = -1;

function movedIndex(index: number, step: number, count: number): number {
  const positions = count + 1;
  return ((index + 1 + step + positions) % positions) - 1;
}

export function useActiveOption({
  count,
  resetKey,
  onChoose,
  onDismiss,
}: ActiveOptionConfig): ActiveOption {
  const [active, setActive] = useState({ index: NONE, resetKey });
  const activeIndex = active.resetKey === resetKey ? active.index : NONE;

  function move(step: number): void {
    setActive({ index: movedIndex(activeIndex, step, count), resetKey });
  }

  function choose(): void {
    if (count > 0) {
      onChoose(Math.max(activeIndex, 0));
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(event.key === 'ArrowDown' ? 1 : -1);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      choose();
    }
    if (event.key === 'Escape') {
      onDismiss();
    }
  }

  return { activeIndex, onKeyDown };
}
