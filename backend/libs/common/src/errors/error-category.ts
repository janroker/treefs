export const errorCategory = {
  BAD_REQUEST: 'badRequest',
  VALIDATION: 'validation',
  NOT_FOUND: 'notFound',
  CONFLICT: 'conflict',
  PAYLOAD_TOO_LARGE: 'payloadTooLarge',
  UNPROCESSABLE: 'unprocessable',
  INTERNAL_SERVER: 'internalServer',
} as const;

export type ErrorCategory = (typeof errorCategory)[keyof typeof errorCategory];
