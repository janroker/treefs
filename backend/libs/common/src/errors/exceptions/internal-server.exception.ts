import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class InternalServerException extends RuntimeException {
  readonly category = errorCategory.INTERNAL_SERVER;
  readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
}
