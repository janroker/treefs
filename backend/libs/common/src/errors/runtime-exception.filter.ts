import { randomUUID } from 'node:crypto';
import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { InternalServerException } from './exceptions/internal-server.exception';
import type { RuntimeException } from './exceptions';
import { toRuntimeException } from './to-runtime-exception';

const CORRELATION_HEADER = 'x-request-id';

function correlationIdOf(request: Request): string {
  const sent = request.header(CORRELATION_HEADER);
  return sent === undefined || sent.length === 0 ? randomUUID() : sent;
}

@Catch()
export class RuntimeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RuntimeExceptionFilter.name);

  public catch(error: unknown, host: ArgumentsHost): void {
    const exception = this.translate(error);
    this.log(exception, error);
    const http = host.switchToHttp();
    const correlationId = correlationIdOf(http.getRequest<Request>());
    const response = http.getResponse<Response>();
    response
      .status(exception.getStatusCode())
      .set(CORRELATION_HEADER, correlationId)
      .json(exception.toErrorDto(correlationId));
  }

  protected translate(error: unknown): RuntimeException {
    return toRuntimeException(error);
  }

  private log(exception: RuntimeException, error: unknown): void {
    if (exception instanceof InternalServerException) {
      this.logger.error(
        error instanceof Error ? (error.stack ?? error.message) : String(error),
      );
      return;
    }
    this.logger.warn(`${exception.getCode()}: ${exception.message}`);
  }
}
