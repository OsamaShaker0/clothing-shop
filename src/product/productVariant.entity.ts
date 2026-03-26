import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductVariantSize } from './enums/product-variant-size.enum';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
  @Column()
  productId: string;
  @Column()
  color: string;
  @Column({ type: 'enum', enum: ProductVariantSize })
  size: ProductVariantSize;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceAfterDiscount: number;
  @Column('int')
  stock: number;
  @Column({ type: 'json', nullable: true })
  imagesUrl: string[];
  @Column({ type: 'int', default: 0 })
  sellsVariantCount: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
