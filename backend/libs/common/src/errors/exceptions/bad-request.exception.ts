import { HttpStatus } from '@nestjs/common';
import { errorCategory } from '../error-category';
import { RuntimeException } from './runtime.exception';

export class BadRequestException extends RuntimeException {
  protected readonly category = errorCategory.BAD_REQUEST;
  protected readonly statusCode = HttpStatus.BAD_REQUEST;
}
