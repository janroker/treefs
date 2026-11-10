import { HttpException, HttpStatus } from '@nestjs/common';
import { exceptionStatus } from '../exception-status';
import { ConflictException, ValidationException } from '../exceptions';
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
    [HttpStatus.METHOD_NOT_ALLOWED, 'badRequest.badRequest'],
  ])('maps the HTTP status %s to %s', (status, code) => {
    const exception = toRuntimeException(new HttpException('x', status));

    expect(exception.toErrorDto('id').code).toBe(code);
  });

  it('hides the message of unexpected errors', () => {
    const dto = toRuntimeException(new Error('secret')).toErrorDto('id');

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

    expect(exception.toErrorDto('id').errors).toEqual([
      { path: 'name', message: 'required' },
    ]);
  });
});
