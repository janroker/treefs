import { itemType, type ItemType } from '@app/common/enums';
import { MAX_ITEM_DEPTH, MAX_ITEM_NAME_BYTES } from '@app/common/constants';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  type IndexOptions,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

const unmanagedUniqueIndex = {
  unique: true,
  synchronize: false,
} as IndexOptions;

@Entity()
@Index(['nameKey', 'id'])
@Index('item_sibling_name_uq', ['parentId', 'nameKey'], unmanagedUniqueIndex)
@Check(`"depth" BETWEEN 0 AND ${String(MAX_ITEM_DEPTH)}`)
@Check(`octet_length("name") BETWEEN 1 AND ${String(MAX_ITEM_NAME_BYTES)}`)
export class Item {
  @PrimaryColumn({ type: 'uuid', default: () => 'uuidv7()' })
  public id!: string;

  @Column({ type: 'enum', enum: itemType })
  public type!: ItemType;

  @Column({ type: 'uuid', nullable: true })
  public parentId!: string | null;

  @ManyToOne(() => Item, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  public parent!: Item | null;

  @Column({ type: 'varchar', length: MAX_ITEM_NAME_BYTES })
  public name!: string;

  @Column({
    type: 'varchar',
    length: 510,
    collation: 'C',
    generatedType: 'STORED',
    asExpression: 'lower(normalize("name", NFC))',
  })
  public nameKey!: string;

  @Column({ type: 'smallint' })
  public depth!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;
}
