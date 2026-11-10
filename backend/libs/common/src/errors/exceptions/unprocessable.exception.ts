import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class UnprocessableException extends RuntimeException {
  protected readonly category = errorCategory.UNPROCESSABLE;
  protected readonly statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
}
