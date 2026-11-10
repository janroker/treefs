import { Test, type TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../database.module';

export function createDatabaseTestModule(): Promise<TestingModule> {
  return Test.createTestingModule({ imports: [DatabaseModule] }).compile();
}
