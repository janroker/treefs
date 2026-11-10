import { useId } from 'react';
import type { SearchNavigation, SearchNavigationConfig } from './hooks.types';
import { useActiveOption } from './useActiveOption';

export function useSearchNavigation({
  items,
  onSelect,
  onDismiss,
}: SearchNavigationConfig): SearchNavigation {
  const listId = useId();

  function choose(index: number): void {
    const item = items[index];
    if (item !== undefined) {
      onSelect(item);
      onDismiss();
    }
  }

  const { activeIndex, onKeyDown } = useActiveOption({
    count: items.length,
    onChoose: choose,
    onDismiss,
  });
  const activeId =
    activeIndex < 0 ? undefined : `${listId}-${String(activeIndex)}`;

  return { listId, activeIndex, activeId, onKeyDown, choose };
}
