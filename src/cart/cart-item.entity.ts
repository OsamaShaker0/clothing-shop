import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/product/product.entity';
import { ProductVariant } from 'src/product/productVariant.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, {
    onDelete: 'CASCADE',
  })
  cart: Cart;
  @Column()
  cartId: string;
  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  product: Product;
  @Column()
  productId: string;

  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  productVariant: ProductVariant;
  @Column()
  variantId: string;
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceAfterDiscount: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
