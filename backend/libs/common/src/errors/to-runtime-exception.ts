import { HttpException, HttpStatus } from '@nestjs/common';
import { exceptionStatus } from './exception-status';
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
  PayloadTooLargeException,
  RuntimeException,
  TooManyRequestsException,
} from './exceptions';

const FIRST_SERVER_ERROR = 500;
const INTERNAL_MESSAGE = 'Something went wrong';

const knownStatuses = new Map<number, (message: string) => RuntimeException>([
  [
    HttpStatus.NOT_FOUND,
    (message) =>
      new NotFoundException(message, exceptionStatus.ROUTE_NOT_FOUND),
  ],
  [
    HttpStatus.PAYLOAD_TOO_LARGE,
    (message) =>
      new PayloadTooLargeException(message, exceptionStatus.PAYLOAD_TOO_LARGE),
  ],
  [
    HttpStatus.TOO_MANY_REQUESTS,
    (message) =>
      new TooManyRequestsException(message, exceptionStatus.RATE_LIMITED),
  ],
]);

function fromHttpStatus(status: number, message: string): RuntimeException {
  const known = knownStatuses.get(status);
  if (known !== undefined) {
    return known(message);
  }
  return status < FIRST_SERVER_ERROR
    ? new BadRequestException(message, exceptionStatus.BAD_REQUEST)
    : new InternalServerException(INTERNAL_MESSAGE, exceptionStatus.INTERNAL);
}

function exposedStatusOf(error: unknown): number | undefined {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('status' in error) ||
    !('expose' in error)
  ) {
    return undefined;
  }
  return error.expose === true && typeof error.status === 'number'
    ? error.status
    : undefined;
}

export function toRuntimeException(error: unknown): RuntimeException {
  if (error instanceof RuntimeException) {
    return error;
  }
  if (error instanceof HttpException) {
    return fromHttpStatus(error.getStatus(), error.message);
  }
  const exposed = exposedStatusOf(error);
  if (exposed !== undefined) {
    return fromHttpStatus(exposed, 'The request could not be read');
  }
  return new InternalServerException(
    INTERNAL_MESSAGE,
    exceptionStatus.INTERNAL,
  );
}
