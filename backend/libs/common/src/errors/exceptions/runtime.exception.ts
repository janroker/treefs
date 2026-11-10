import type { ErrorDto } from '../../dto';
import type { ErrorCategory } from '../error-category';
import type { ExceptionStatus } from '../exception-status';

export abstract class RuntimeException extends Error {
  protected abstract readonly category: ErrorCategory;
  protected abstract readonly statusCode: number;

  public constructor(
    message: string,
    private readonly status: ExceptionStatus,
  ) {
    super(message);
    this.name = new.target.name;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public getCode(): string {
    return `${this.category}.${this.status}`;
  }

  public toErrorDto(correlationId: string): ErrorDto {
    return {
      code: this.getCode(),
      message: this.message,
      statusCode: this.statusCode,
      correlationId,
    };
  }
}
