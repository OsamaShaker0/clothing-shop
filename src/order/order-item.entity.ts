import { ProductVariantSize } from 'src/product/enums/product-variant-size.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { ProductVariant } from 'src/product/productVariant.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  orderId: string;
  @Column({ type: 'uuid' })
  productId: string;
  @ManyToOne(() => ProductVariant)
  variant: ProductVariant;
  @Column({ type: 'uuid' })
  variantId: string;
  @Column()
  color: string;
  @Column({ type: 'enum', enum: ProductVariantSize })
  size: ProductVariantSize;
  @Column('int')
  quantity: number;
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceAfterDiscount: number;
  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
  @CreateDateColumn()
  createdAt: Date;
}
