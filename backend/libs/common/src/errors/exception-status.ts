export const exceptionStatus = {
  VALIDATION: 'validation',
  INVALID_CURSOR: 'invalidCursor',
  ITEM_NOT_FOUND: 'itemNotFound',
  PARENT_NOT_FOUND: 'parentNotFound',
  PARENT_NOT_FOLDER: 'parentNotFolder',
  NAME_TAKEN: 'nameTaken',
  DEPTH_EXCEEDED: 'depthExceeded',
  RATE_LIMITED: 'rateLimited',
  DEPENDENCY_UNAVAILABLE: 'dependencyUnavailable',
  ROUTE_NOT_FOUND: 'routeNotFound',
  PAYLOAD_TOO_LARGE: 'payloadTooLarge',
  BAD_REQUEST: 'badRequest',
  INTERNAL: 'internal',
} as const;

export type ExceptionStatus =
  (typeof exceptionStatus)[keyof typeof exceptionStatus];
