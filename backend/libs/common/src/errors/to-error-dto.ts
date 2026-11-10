import type { ErrorDto } from '../dto/error.dto';
import { ValidationException } from './exceptions/validation.exception';
import type { RuntimeException } from './exceptions';

export function toErrorDto(
  exception: RuntimeException,
  correlationId: string,
): ErrorDto {
  const dto: ErrorDto = {
    code: `${exception.category}.${exception.status}`,
    message: exception.message,
    statusCode: exception.statusCode,
    correlationId,
  };
  if (exception instanceof ValidationException) {
    dto.errors = exception.fieldErrors;
  }
  return dto;
}
