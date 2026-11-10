import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateItem1794278164630 implements MigrationInterface {
  public name = 'CreateItem1794278164630';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      CREATE TYPE "public"."item_type_enum" AS ENUM('file', 'folder')
    `);
    await queryRunner.query(
      /* sql */ `
        INSERT INTO
          "typeorm_metadata" (
            "database",
            "schema",
            "table",
            "type",
            "name",
            "value"
          )
        VALUES
          ($1, $2, $3, $4, $5, $6)
      `,
      [
        'treefs',
        'public',
        'item',
        'GENERATED_COLUMN',
        'nameKey',
        'lower(normalize("name", NFC))',
      ],
    );
    await queryRunner.query(/* sql */ `
      CREATE TABLE "item" (
        "id" uuid NOT NULL DEFAULT uuidv7(),
        "type" "public"."item_type_enum" NOT NULL,
        "parentId" uuid,
        "name" character varying(255) NOT NULL,
        "nameKey" character varying(510) GENERATED ALWAYS AS (lower(normalize("name", NFC))) STORED COLLATE "C" NOT NULL,
        "depth" smallint NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_a9403bbc82aa2638eb93a91d3e" CHECK (octet_length("name") BETWEEN 1 AND 255),
        CONSTRAINT "CHK_8937657eca2bd20686ae070779" CHECK ("depth" BETWEEN 0 AND 64),
        CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_69df6c0e55ed3178343f81a022" ON "item" ("nameKey", "id")
    `);
    await queryRunner.query(/* sql */ `
      ALTER TABLE "item"
      ADD CONSTRAINT "FK_2e3b654a1f669d356e259e7ca3c" FOREIGN KEY ("parentId") REFERENCES "item" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(/* sql */ `
      CREATE UNIQUE INDEX "item_sibling_name_uq" ON "item" ("parentId", "nameKey") NULLS NOT DISTINCT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."item_sibling_name_uq"
    `);
    await queryRunner.query(/* sql */ `
      ALTER TABLE "item"
      DROP CONSTRAINT "FK_2e3b654a1f669d356e259e7ca3c"
    `);
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_69df6c0e55ed3178343f81a022"
    `);
    await queryRunner.query(/* sql */ `DROP TABLE "item"`);
    await queryRunner.query(
      /* sql */ `
        DELETE FROM "typeorm_metadata"
        WHERE
          "type" = $1
          AND "name" = $2
          AND "database" = $3
          AND "schema" = $4
          AND "table" = $5
      `,
      ['GENERATED_COLUMN', 'nameKey', 'treefs', 'public', 'item'],
    );
    await queryRunner.query(/* sql */ `DROP TYPE "public"."item_type_enum"`);
  }
}
