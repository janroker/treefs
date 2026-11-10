import { type KeyboardEvent, useState } from 'react';
import type { ActiveOption, ActiveOptionConfig } from './hooks.types';

const NONE = -1;

function movedIndex(index: number, step: number, count: number): number {
  const positions = count + 1;
  return ((index + 1 + step + positions) % positions) - 1;
}

export function useActiveOption({
  count,
  onChoose,
  onDismiss,
}: ActiveOptionConfig): ActiveOption {
  const [index, setIndex] = useState(NONE);
  const activeIndex = index < count ? index : NONE;

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        setIndex(
          movedIndex(activeIndex, event.key === 'ArrowDown' ? 1 : -1, count),
        );
        break;
      case 'Enter':
        if (activeIndex !== NONE) {
          event.preventDefault();
          onChoose(activeIndex);
        }
        break;
      case 'Escape':
        onDismiss();
        break;
      default:
        break;
    }
  }

  return { activeIndex, onKeyDown };
}
