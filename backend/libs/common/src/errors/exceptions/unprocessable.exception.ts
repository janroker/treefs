import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class UnprocessableException extends RuntimeException {
  readonly category = errorCategory.UNPROCESSABLE;
  readonly statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
}
