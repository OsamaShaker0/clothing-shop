import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { CreateVariantDto } from 'src/product/dtos/create-variant.dto';
import { DeleteProductVariantDto } from 'src/product/dtos/delete-product-variant.dto';
import { EditProductVariantBodyDto } from 'src/product/dtos/edit-product-variant-body.dto';
import { EditProductVariantDto } from 'src/product/dtos/edit-product-variant.dto';
import { ProductVariantService } from 'src/product/providers/product-variant.service';
@UseGuards(AdminAccessOnlyGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('product-variants-dashboard')
export class ProductVariantDashboardController {
  constructor(private readonly productVariantService: ProductVariantService) {}
  @Post(':productId/variants')
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
  public async deleteProductVariantById(
    @Param() deleteProductVariantDto: DeleteProductVariantDto,
  ) {
    return this.productVariantService.deleteVariant(deleteProductVariantDto);
  }
}
