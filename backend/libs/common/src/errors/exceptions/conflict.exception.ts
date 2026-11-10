import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class ConflictException extends RuntimeException {
  readonly category = errorCategory.CONFLICT;
  readonly statusCode = HttpStatus.CONFLICT;
}
