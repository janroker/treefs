import { RuntimeExceptionFilter } from '@app/common/errors';
import { Catch } from '@nestjs/common';

@Catch()
export class ApiExceptionFilter extends RuntimeExceptionFilter {}
