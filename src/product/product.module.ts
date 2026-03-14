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
import { ProductsVariantController } from './products-variant.controller';
import { ProductVariantService } from './providers/product-variant.service';
import { FindAllProductVariantProvider } from './providers/find-all-product-variant.provider';
import { FindOneVariantForProductProvider } from './providers/find-one-variant-for-product.provider';
import { CreateVariantForProductProvider } from './providers/create-variant-for-product.provider';
import { ProductVariant } from './productVariant.entity';
import { PatchVariantForProductProvider } from './providers/patch-variant-for-product.provider';
import { DeleteVariantForProductProvider } from './providers/delete-variant-for-product.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductVariant]),
    CategoryModule,
  ],
  controllers: [ProductController, ProductsVariantController],
  exports: [ProductService, ProductVariantService],
  providers: [
    CreateProductProvider,
    ProductService,
    GetProductsProvider,
    GetOneProductProvider,
    UpdateProductProvider,
    DeleteProductProvider,
    GetProductsByCategoryIdProvider,
    ProductVariantService,
    FindAllProductVariantProvider,
    FindOneVariantForProductProvider,
    CreateVariantForProductProvider,
    PatchVariantForProductProvider,
    DeleteVariantForProductProvider,
  ],
})
export class ProductModule {}
