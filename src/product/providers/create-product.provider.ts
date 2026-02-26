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
      let categoryId = createProductDto.categoryId;
      let category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });
      if (!category) {
        throw new BadRequestException(
          `You try adding product to non existing category `,
        );
      }

      let product = this.productRepository.create(createProductDto);
      product.category = category;
      product = await this.productRepository.save(product);
      return product;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Slug already exists');
      }
      throw new InternalServerErrorException(
        'Cannot create category, please try again later',
        { description: error },
      );
    }
  }
}
