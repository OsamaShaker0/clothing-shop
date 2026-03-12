import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Category } from 'src/category/categories.entity';
import { ProductController } from './product.controller';
import { CreateProductProvider } from './providers/create-product.provider';
import { ProductService } from './providers/product.service';
import { GetProductsProvider } from './providers/get-products.provider';
import { GetOneProductProvider } from './providers/get-one-product.provider';
import { UpdateProductProvider } from './providers/update-product.provider';
import { DeleteProductProvider } from './providers/delete-product.provider';
import { GetProductsByCategoryIdProvider } from './providers/get-products-by-category-id.provider';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), CategoryModule],
  controllers: [ProductController],
  exports: [ProductService],
  providers: [
    CreateProductProvider,
    ProductService,
    GetProductsProvider,
    GetOneProductProvider,
    UpdateProductProvider,
    DeleteProductProvider,
    GetProductsByCategoryIdProvider,
  ],
})
export class ProductModule {}
