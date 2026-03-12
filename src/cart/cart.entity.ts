import { Users } from 'src/user/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Users, { nullable: true, onDelete: 'CASCADE' })
  user: Users;
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;
  @Column({ type: 'uuid', nullable: true })
  guestId: string | null;
  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
