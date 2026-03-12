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
import { CloudinaryService } from 'src/cloudinary/providers/cloudinary.service';

@Injectable()
export class CreateProductProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async createProduct(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    const uploadedImages =
      await this.cloudinaryService.uploadMultipleImages(files);

    createProductDto.imagesUrl = uploadedImages.map((img) => img.imageUrl);
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
      console.error(error);
      await Promise.all(
        uploadedImages.map((img) =>
          this.cloudinaryService.deleteImage(img.publicId),
        ),
      );
      if (error?.code === '23505') {
        throw new ConflictException('Slug already exists');
      }
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException(
        'Cannot create product, please try again later',
        { description: String(error) },
      );
    }
  }
}
