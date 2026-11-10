type IsolationLevel = 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE';

export type TransactionOptions = {
  isolation?: IsolationLevel;
  maxAttempts?: number;
};

export type DriverError = {
  code?: unknown;
  constraint?: unknown;
};
