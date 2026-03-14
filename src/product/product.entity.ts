import { Category } from 'src/category/categories.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { GenderEnum } from './enums/product-gender.enum';
import { ProductTypeEnum } from './enums/product-type.enum';
import { ProductVariant } from './productVariant.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  slug: string;
  @Column({ type: 'text' })
  description: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceAfterDiscount: number;
  @Column({ type: 'json' })
  imagesUrl: string[];
  @Column({ default: true })
  isActive: boolean;
  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  category: Category;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    default: GenderEnum.BOTH,
  })
  gender: GenderEnum;
  @Column({
    type: 'enum',
    enum: ProductTypeEnum,
  })
  productType: ProductTypeEnum;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
