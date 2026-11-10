import { useState } from 'react';
import type { MatchMode } from '../api/api.types';
import type { SearchScope, TypeFilter } from '../components/components.types';
import type { SearchForm } from './hooks.types';

export function useSearchForm(): SearchForm {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const [match, setMatch] = useState<MatchMode>('prefix');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('both');
  const [scope, setScope] = useState<SearchScope>('folder');
  return {
    text,
    setText,
    focused,
    setFocused,
    match,
    setMatch,
    typeFilter,
    setTypeFilter,
    scope,
    setScope,
  };
}
