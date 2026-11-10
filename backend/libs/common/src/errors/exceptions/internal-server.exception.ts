import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class InternalServerException extends RuntimeException {
  protected readonly category = errorCategory.INTERNAL_SERVER;
  protected readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
}
