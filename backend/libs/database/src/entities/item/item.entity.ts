import { itemType, type ItemType } from '@app/common';
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
@Check('"depth" BETWEEN 0 AND 64')
@Check('octet_length("name") BETWEEN 1 AND 255')
export class Item {
  @PrimaryColumn({ type: 'uuid', default: () => 'uuidv7()' })
  id!: string;

  @Column({ type: 'enum', enum: itemType })
  type!: ItemType;

  @Column({ type: 'uuid', nullable: true })
  parentId!: string | null;

  @ManyToOne(() => Item, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  parent!: Item | null;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({
    type: 'varchar',
    length: 510,
    collation: 'C',
    generatedType: 'STORED',
    asExpression: 'lower(normalize("name", NFC))',
  })
  nameKey!: string;

  @Column({ type: 'smallint' })
  depth!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
