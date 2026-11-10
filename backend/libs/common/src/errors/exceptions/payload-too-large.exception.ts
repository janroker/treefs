import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class PayloadTooLargeException extends RuntimeException {
  readonly category = errorCategory.PAYLOAD_TOO_LARGE;
  readonly statusCode = HttpStatus.PAYLOAD_TOO_LARGE;
}
