import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './providers/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { CreateCategoryProvider } from './providers/create-category.provider';
import { Product } from 'src/product/product.entity';
import { GetCategoriesProvider } from './providers/get-categories.provider';
import { GetOneCategoryProvider } from './providers/get-one-category.provider';
import { UpdateCategoryProvider } from './providers/update-category.provider';
import { DeleteCategoryProvider } from './providers/delete-category.provider';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CreateCategoryProvider, GetCategoriesProvider, GetOneCategoryProvider, UpdateCategoryProvider, DeleteCategoryProvider],
  imports: [TypeOrmModule.forFeature([Category , Product])],
})
export class CategoryModule {}
