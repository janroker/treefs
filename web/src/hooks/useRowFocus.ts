import { type RefObject, useEffect } from 'react';
import type { RowFocus } from '../components/components.types';

export function useRowFocus(
  rowRef: RefObject<HTMLElement | null>,
  focus: RowFocus | null,
  id: string,
): boolean {
  const focused = focus?.id === id;
  const flash = focused && focus.flash;

  useEffect(() => {
    if (focused) {
      rowRef.current?.focus({ preventScroll: flash });
    }
    if (flash) {
      rowRef.current?.scrollIntoView({ block: 'center' });
    }
  }, [rowRef, focused, flash]);

  return flash;
}
