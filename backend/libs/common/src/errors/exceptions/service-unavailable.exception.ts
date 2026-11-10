import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class ServiceUnavailableException extends RuntimeException {
  readonly category = errorCategory.SERVICE_UNAVAILABLE;
  readonly statusCode = HttpStatus.SERVICE_UNAVAILABLE;
  readonly retryAfterSeconds = 5;
}
