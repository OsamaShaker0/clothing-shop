import { Injectable } from '@nestjs/common';
import { FindAllProductVariantProvider } from './find-all-product-variant.provider';
import { FindOneVariantForProductProvider } from './find-one-variant-for-product.provider';
import { FindOneVariantForProductDto } from '../dtos/find-one-variant-for-product.dto';
import { CreateVariantDto } from '../dtos/create-variant.dto';
import { CreateVariantForProductProvider } from './create-variant-for-product.provider';
import { PatchVariantForProductProvider } from './patch-variant-for-product.provider';
import { EditProductVariantDto } from '../dtos/edit-product-variant.dto';
import { EditProductVariantBodyDto } from '../dtos/edit-product-variant-body.dto';
import { DeleteProductVariantDto } from '../dtos/delete-product-variant.dto';
import { DeleteVariantForProductProvider } from './delete-variant-for-product.provider';
import { BestSellerProvider } from './best-seller.provider';

@Injectable()
export class ProductVariantService {
  constructor(
    private readonly findAllProductVariantsProvider: FindAllProductVariantProvider,

    private readonly findOneVariantForProductProvider: FindOneVariantForProductProvider,

    private readonly createVariantProvider: CreateVariantForProductProvider,

    private readonly patchVariantForProductProvider: PatchVariantForProductProvider,

    private readonly deleteVariantForProductProvider: DeleteVariantForProductProvider,

    private readonly bestSellerProvider: BestSellerProvider,
  ) {}

  public async getBestSeller() {
    return await this.bestSellerProvider.getBestSellerVariants();
  }

  public async findAllProductVariant(productId: string) {
    return this.findAllProductVariantsProvider.findAllProductVariant(productId);
  }
  public async findOneVariantForProduct(
    findOneVariantForProductDto: FindOneVariantForProductDto,
  ) {
    return this.findOneVariantForProductProvider.findOneVariantForProduct(
      findOneVariantForProductDto,
    );
  }
  public async createVariantForProduct(
    productId: string,
    createVariantDto: CreateVariantDto,
    files: Express.Multer.File[],
  ) {
    return this.createVariantProvider.createVariant(
      productId,
      createVariantDto,
      files,
    );
  }
  public async patchVariant(
    editProductVariantDto: EditProductVariantDto,
    editProductVariantBodyDto: EditProductVariantBodyDto,
  ) {
    return this.patchVariantForProductProvider.editProductVariantById(
      editProductVariantDto,
      editProductVariantBodyDto,
    );
  }
  public async patchVariantPhotos(
    editProductVariantDto: EditProductVariantDto,
    files: Express.Multer.File[],
  ) {
    return this.patchVariantForProductProvider.editProductVariantPhotosById(
      editProductVariantDto,
      files,
    );
  }

  public async deleteVariant(deleteProductVariantDto: DeleteProductVariantDto) {
    return this.deleteVariantForProductProvider.deleteProductVariantById(
      deleteProductVariantDto,
    );
  }
}
