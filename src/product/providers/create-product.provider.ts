import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { Category } from 'src/category/categories.entity';

@Injectable()
export class CreateProductProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async createProduct(createProductDto: CreateProductDto) {
    try {
      const { categoryId, ...productData } = createProductDto;

      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });

      if (!category) {
        throw new BadRequestException(
          'You are trying to add a product to a non-existing category',
        );
      }

      const product = this.productRepository.create({
        ...productData,
        category,
      });

      return await this.productRepository.save(product);
    } catch (error) {
      if (error?.code === '23505') {
        throw new ConflictException('Slug already exists');
      }

      throw new InternalServerErrorException(
        'Cannot create product, please try again later',
      );
    }
  }
}
