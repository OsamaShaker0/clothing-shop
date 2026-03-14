import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductVariantService } from './providers/product-variant.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { FindOneVariantForProductDto } from './dtos/find-one-variant-for-product.dto';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { CreateVariantDto } from './dtos/create-variant.dto';
import { EditProductVariantDto } from './dtos/edit-product-variant.dto';
import { EditProductVariantBodyDto } from './dtos/edit-product-variant-body.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DeleteProductVariantDto } from './dtos/delete-product-variant.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductsVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Get(':productId/variants')
  @Public()
  public async findAllVariantForProduct(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.productVariantService.findAllProductVariant(productId);
  }
  @Get(':productId/variants/:variantId')
  @Public()
  public async findOneVariantForProductById(
    @Param() findOneVariantForProductDto: FindOneVariantForProductDto,
  ) {
    return this.productVariantService.findOneVariantForProduct(
      findOneVariantForProductDto,
    );
  }
  @Post(':productId/variants')
  @UseGuards(AdminAccessOnlyGuard)
  @UseInterceptors(FilesInterceptor('images', 6))
  public async createVariantForProduct(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() createVariantDto: CreateVariantDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productVariantService.createVariantForProduct(
      productId,
      createVariantDto,
      files,
    );
  }
  @Patch('/:productId/variants/:variantId')
  @UseGuards(AdminAccessOnlyGuard)
  public async editProductVariantById(
    @Param() editProductVariantDto: EditProductVariantDto,
    @Body() editProductVariantBodyDto: EditProductVariantBodyDto,
  ) {
    return this.productVariantService.patchVariant(
      editProductVariantDto,
      editProductVariantBodyDto,
    );
  }
  @Patch(':productId/variants/:variantId/photos')
  @UseGuards(AdminAccessOnlyGuard)
  @UseInterceptors(FilesInterceptor('images', 6))
  updateVariantPhotos(
    @Param() editProductVariantDto: EditProductVariantDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productVariantService.patchVariantPhotos(
      editProductVariantDto,
      files,
    );
  }
  @Delete('/:productId/variants/:variantId')
  @UseGuards(AdminAccessOnlyGuard)
  public async deleteProductVariantById(
    @Param() deleteProductVariantDto: DeleteProductVariantDto,
  ) {
    return this.productVariantService.deleteVariant(deleteProductVariantDto);
  }
}

