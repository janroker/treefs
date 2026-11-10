import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class ConflictException extends RuntimeException {
  protected readonly category = errorCategory.CONFLICT;
  protected readonly statusCode = HttpStatus.CONFLICT;
}
