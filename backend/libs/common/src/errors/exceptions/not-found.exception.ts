import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class NotFoundException extends RuntimeException {
  readonly category = errorCategory.NOT_FOUND;
  readonly statusCode = HttpStatus.NOT_FOUND;
}
