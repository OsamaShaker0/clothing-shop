import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Category } from 'src/category/categories.entity';
import { ProductController } from './product.controller';
import { CreateProductProvider } from './providers/create-product.provider';
import { ProductService } from './providers/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductController],
  providers: [CreateProductProvider, ProductService],
})
export class ProductModule {}
