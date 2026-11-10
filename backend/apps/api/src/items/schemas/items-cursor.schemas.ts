import { z } from 'zod';

export const nameCursorSchema = z.object({ k: z.string() });

export const idCursorSchema = z.object({ id: z.uuid() });
