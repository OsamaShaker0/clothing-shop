import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from '../productVariant.entity';
import { Repository } from 'typeorm';
import { EditProductVariantDto } from '../dtos/edit-product-variant.dto';
import { EditProductVariantBodyDto } from '../dtos/edit-product-variant-body.dto';
import { CloudinaryService } from 'src/cloudinary/providers/cloudinary.service';

@Injectable()
export class PatchVariantForProductProvider {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async editProductVariantById(
    editProductVariantDto: EditProductVariantDto,
    editProductVariantBodyDto: EditProductVariantBodyDto,
  ) {
    try {
      if (
        !editProductVariantBodyDto.color &&
        !editProductVariantBodyDto.size &&
        !!editProductVariantBodyDto.stock
      ) {
        throw new BadRequestException('provide variant color , size or stock');
      }
      const variant = await this.productVariantRepository.findOne({
        where: {
          id: editProductVariantDto.variantId,
          productId: editProductVariantDto.productId,
        },
      });

      if (!variant) {
        throw new NotFoundException(
          `Variant with id ${editProductVariantDto.variantId} not found`,
        );
      }

      Object.assign(variant, editProductVariantBodyDto);
      return await this.productVariantRepository.save(variant);
    } catch (error) {
      console.error(error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
  public async editProductVariantPhotosById(
    editProductVariantDto: EditProductVariantDto,
    files: Express.Multer.File[],
  ) {
    try {
      if (!files || files.length === 0) {
        throw new NotAcceptableException('No images uploaded');
      }

      const variant = await this.productVariantRepository.findOne({
        where: {
          id: editProductVariantDto.variantId,
          productId: editProductVariantDto.productId,
        },
      });

      if (!variant) {
        throw new NotFoundException(
          `Variant with id ${editProductVariantDto.variantId} not found`,
        );
      }

      const uploadedImages =
        await this.cloudinaryService.uploadMultipleImages(files);
      const images = uploadedImages.map((img) => img.imageUrl);
      const result = await this.productVariantRepository.update(
        {
          id: editProductVariantDto.variantId,
          productId: editProductVariantDto.productId,
        },
        {
          imagesUrl: images,
        },
      );
      if (!result.affected) {
        throw new NotFoundException(
          `Variant with id ${editProductVariantDto.variantId} not found`,
        );
      }
    } catch (error) {
      console.error(error);
      if (
        error instanceof NotFoundException ||
        error instanceof NotAcceptableException
      )
        throw error;
      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
}
