import { HttpException, HttpStatus } from '@nestjs/common';
import { exceptionStatus } from '../exception-status';
import { ConflictException, ValidationException } from '../exceptions';
import { toErrorDto } from '../to-error-dto';
import { toRuntimeException } from '../to-runtime-exception';

describe('toRuntimeException', () => {
  it('keeps runtime exceptions as they are', () => {
    const exception = new ConflictException(
      'taken',
      exceptionStatus.NAME_TAKEN,
    );

    expect(toRuntimeException(exception)).toBe(exception);
  });

  it.each([
    [HttpStatus.NOT_FOUND, 'notFound.routeNotFound'],
    [HttpStatus.PAYLOAD_TOO_LARGE, 'payloadTooLarge.payloadTooLarge'],
    [HttpStatus.TOO_MANY_REQUESTS, 'tooManyRequests.rateLimited'],
    [HttpStatus.METHOD_NOT_ALLOWED, 'badRequest.badRequest'],
  ])('maps the HTTP status %s to %s', (status, code) => {
    const exception = toRuntimeException(new HttpException('x', status));

    expect(toErrorDto(exception, 'id').code).toBe(code);
  });

  it('hides the message of unexpected errors', () => {
    const dto = toErrorDto(toRuntimeException(new Error('secret')), 'id');

    expect(dto).toEqual({
      code: 'internalServer.internal',
      message: 'Something went wrong',
      statusCode: 500,
      correlationId: 'id',
    });
  });

  it('lists the invalid fields of a validation exception', () => {
    const exception = new ValidationException('invalid', [
      { path: 'name', message: 'required' },
    ]);

    expect(toErrorDto(exception, 'id').errors).toEqual([
      { path: 'name', message: 'required' },
    ]);
  });
});
