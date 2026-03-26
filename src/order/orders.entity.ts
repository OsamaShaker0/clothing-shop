import type { Address } from './interfaces/address.interface';
import { OrderStatus } from './enums/order-status.enum';
import { OrderItem } from './order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentMethod } from './enums/payment-method.enum';
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  firstName: string;
  @Column({ type: 'varchar' })
  lastName: string;
  @Column({ type: 'uuid', nullable: true })
  userId: string;
  @Column({ type: 'uuid', nullable: true })
  guestId: string;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;
  @Column()
  phoneNumber: string;
  @Column({ type: 'jsonb' })
  address: Address;
  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    nullable: true,
  })
  orderItems?: OrderItem[];
  @Column({ type: 'boolean', default: false })
  payedStatus?: boolean;
  @Column('uuid', { array: true })
  orderItemsIds: string[];
  @Column('decimal', { precision: 10, scale: 2 })
  orderPrice: number;
  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH })
  payment: PaymentMethod;
  @Column('int', { nullable: true })
  discountCouponPercentage: number;
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountAmount: number;
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  priceAfterApplyCoupon: number;
  @Column('decimal', { precision: 10, scale: 2 })
  shippingPrice: number;
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;
  @CreateDateColumn()
  createdAt: Date;
}
