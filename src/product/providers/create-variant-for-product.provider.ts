import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from '../productVariant.entity';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { CreateVariantDto } from '../dtos/create-variant.dto';
import { CloudinaryService } from 'src/cloudinary/providers/cloudinary.service';

@Injectable()
export class CreateVariantForProductProvider {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,

    private readonly productService: ProductService,

    private readonly cloudinaryService: CloudinaryService,
  ) {}
  public async createVariant(
    productId: string,
    createVariantDto: CreateVariantDto,
    files: Express.Multer.File[],
  ) {
    const uploadedImages =
      await this.cloudinaryService.uploadMultipleImages(files);
    createVariantDto.imagesUrl = uploadedImages.map((img) => img.imageUrl);
    try {
      const product = await this.productService.getOneProductById(productId);

      const exists = await this.productVariantRepository.findOne({
        where: {
          productId,
          color: createVariantDto.color,
          size: createVariantDto.size,
        },
      });
      if (exists) {
        throw new BadRequestException(
          'Variant with this color and size already exists',
        );
      }
      let variant = this.productVariantRepository.create({
        product,
        productId: product.id,
        price:product.price,
        ...createVariantDto,
      });
      variant = await this.productVariantRepository.save(variant);
      return variant;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
}
