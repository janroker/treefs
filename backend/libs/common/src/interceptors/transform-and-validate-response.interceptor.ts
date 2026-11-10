import {
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { map, type Observable } from 'rxjs';
import type { z } from 'zod';

export class TransformAndValidateResponseInterceptor<
  Raw,
  Dto,
> implements NestInterceptor<Raw, Dto> {
  public constructor(
    private readonly transform: (raw: Raw) => Dto,
    private readonly schema: z.ZodType<Dto>,
  ) {}

  public intercept(
    _context: ExecutionContext,
    next: CallHandler<Raw>,
  ): Observable<Dto> {
    return next
      .handle()
      .pipe(map((raw) => this.schema.parse(this.transform(raw))));
  }
}

export function transformAndValidateResponse<Raw, Dto>(
  transform: (raw: Raw) => Dto,
  schema: z.ZodType<Dto>,
): TransformAndValidateResponseInterceptor<Raw, Dto> {
  return new TransformAndValidateResponseInterceptor(transform, schema);
}
