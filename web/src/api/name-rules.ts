const FORBIDDEN_CHARACTERS = /[/\\\p{Cc}]/u;

export function nameProblem(name: string): string | null {
  return FORBIDDEN_CHARACTERS.test(name)
    ? 'Name must not contain / \\ or control characters'
    : null;
}
