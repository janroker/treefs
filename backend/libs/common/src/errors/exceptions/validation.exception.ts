import { HttpStatus } from '@nestjs/common';
import type { FieldErrorDto } from '../../dto/error.dto';
import { errorCategory } from '../error-category';
import { exceptionStatus } from '../exception-status';
import { RuntimeException } from './runtime.exception';

export class ValidationException extends RuntimeException {
  readonly category = errorCategory.VALIDATION;
  readonly statusCode = HttpStatus.BAD_REQUEST;

  constructor(
    message: string,
    readonly fieldErrors: Array<FieldErrorDto> = [],
  ) {
    super(message, exceptionStatus.VALIDATION);
  }
}
