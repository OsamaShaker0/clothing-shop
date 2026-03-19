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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { CreateVariantDto } from 'src/product/dtos/create-variant.dto';
import { DeleteProductVariantDto } from 'src/product/dtos/delete-product-variant.dto';
import { EditProductVariantBodyDto } from 'src/product/dtos/edit-product-variant-body.dto';
import { EditProductVariantDto } from 'src/product/dtos/edit-product-variant.dto';
import { ProductVariantService } from 'src/product/providers/product-variant.service';

@ApiTags('Product Variants Dashboard')
@ApiBearerAuth()
@UseGuards(AdminAccessOnlyGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('product-variants-dashboard')
export class ProductVariantDashboardController {
  constructor(private readonly productVariantService: ProductVariantService) {}
  @Post(':productId/variants')
  @ApiOperation({ summary: 'Create variant for product' })
  @ApiParam({ name: 'productId', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Variant data with images',
    schema: {
      type: 'object',
      properties: {
        color: { type: 'string' },
        size: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Variant created successfully' })
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
  @ApiOperation({ summary: 'Update product variant' })
  @ApiParam({ name: 'productId', type: 'string' })
  @ApiParam({ name: 'variantId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Variant updated successfully' })
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
  @ApiOperation({ summary: 'Update variant images' })
  @ApiParam({ name: 'productId', type: 'string' })
  @ApiParam({ name: 'variantId', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Variant images updated' })
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
  @ApiOperation({ summary: 'Delete product variant' })
  @ApiParam({ name: 'productId', type: 'string' })
  @ApiParam({ name: 'variantId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Variant deleted successfully' })
  public async deleteProductVariantById(
    @Param() deleteProductVariantDto: DeleteProductVariantDto,
  ) {
    return this.productVariantService.deleteVariant(deleteProductVariantDto);
  }
}
