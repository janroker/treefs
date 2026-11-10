import { HttpStatus } from '@nestjs/common';
import type { ErrorDto, FieldErrorDto } from '../../dto';
import { errorCategory } from '../error-category';
import { exceptionStatus } from '../exception-status';
import { RuntimeException } from './runtime.exception';

export class ValidationException extends RuntimeException {
  protected readonly category = errorCategory.VALIDATION;
  protected readonly statusCode = HttpStatus.BAD_REQUEST;

  public constructor(
    message: string,
    private readonly fieldErrors: Array<FieldErrorDto> = [],
  ) {
    super(message, exceptionStatus.VALIDATION);
  }

  public override toErrorDto(correlationId: string): ErrorDto {
    return { ...super.toErrorDto(correlationId), errors: this.fieldErrors };
  }
}
