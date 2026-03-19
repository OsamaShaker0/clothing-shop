import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  code: string;

  @Column('int')
  percentage: number;
  @Column('int', { default: 0 })
  numberOfUse: number;
  @Column('decimal', { precision: 10, scale: 2 })
  amountOfOrdersDiscount: number;
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
