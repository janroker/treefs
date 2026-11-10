import type { z } from 'zod';

export function parseEnv<T extends z.ZodType>(schema: T): z.output<T> {
  const result = schema.safeParse(process.env);
  if (result.success) {
    return result.data;
  }
  const problems = result.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
  throw new Error(`Config validation error: ${problems}`);
}
