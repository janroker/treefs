import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class TooManyRequestsException extends RuntimeException {
  readonly category = errorCategory.TOO_MANY_REQUESTS;
  readonly statusCode = HttpStatus.TOO_MANY_REQUESTS;
}
