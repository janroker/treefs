import { type FieldErrorDto } from '@app/common/dto';
import { ValidationException } from '@app/common/errors';
import { StandardSchemaValidationPipe } from '@nestjs/common';

type ExceptionFactory = NonNullable<
  NonNullable<
    ConstructorParameters<typeof StandardSchemaValidationPipe>[0]
  >['exceptionFactory']
>;
type Issue = Parameters<ExceptionFactory>[0][number];

function pathOf(issue: Issue): string {
  return (issue.path ?? [])
    .map((segment) =>
      String(typeof segment === 'object' ? segment.key : segment),
    )
    .join('.');
}

function toValidationException(
  issues: ReadonlyArray<Issue>,
): ValidationException {
  const fieldErrors: Array<FieldErrorDto> = issues.map((issue) => ({
    path: pathOf(issue),
    message: issue.message,
  }));
  return new ValidationException('The request is invalid', fieldErrors);
}

export const validationPipe = new StandardSchemaValidationPipe({
  exceptionFactory: toValidationException,
});
