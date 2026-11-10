import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class TooManyRequestsException extends RuntimeException {
  protected readonly category = errorCategory.TOO_MANY_REQUESTS;
  protected readonly statusCode = HttpStatus.TOO_MANY_REQUESTS;
}
