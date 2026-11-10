export const itemType = {
  FILE: 'file',
  FOLDER: 'folder',
} as const;

export type ItemType = (typeof itemType)[keyof typeof itemType];
