import type { ErrorCategory } from '../error-category';
import type { ExceptionStatus } from '../exception-status';

export abstract class RuntimeException extends Error {
  abstract readonly category: ErrorCategory;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    readonly status: ExceptionStatus,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
