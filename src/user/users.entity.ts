import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserGender } from './enums/user-gender.enum';
import { UserRole } from './enums/user-roles.enum';
import { Exclude } from 'class-transformer';
import { Review } from 'src/review/review.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 30 })
  firstName: string;
  @Column({ type: 'varchar', length: 30 })
  lastName: string;
  @Column({ unique: true })
  email: string;
  @Column({ default: false })
  isEmailVerified: boolean;
  @Column({type: 'varchar', nullable: true })
  emailVerificationToken: string | null;
  @Column({ type: 'varchar' })
  @Exclude()
  password: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
  @Column({ type: 'enum', enum: UserGender })
  gender: UserGender;
  @Column({ type: 'int', nullable: true })
  age?: number;
  @Column({ type: 'varchar', nullable: true })
  governorate?: string;
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
}
