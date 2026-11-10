import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class NotFoundException extends RuntimeException {
  protected readonly category = errorCategory.NOT_FOUND;
  protected readonly statusCode = HttpStatus.NOT_FOUND;
}
