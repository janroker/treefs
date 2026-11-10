export const matchMode = {
  EXACT: 'exact',
  PREFIX: 'prefix',
} as const;

export type MatchMode = (typeof matchMode)[keyof typeof matchMode];
