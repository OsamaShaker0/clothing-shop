import { Product } from 'src/product/product.entity';
import { Users } from 'src/user/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['user', 'product'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('decimal')
  rating: number;
  @Column({ nullable: true })
  comment: string;
  @ManyToOne(() => Users, (user) => user.reviews)
  user: Users;
  @Column()
  userId: string;
  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
