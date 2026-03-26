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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductVariant } from './productVariant.entity';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Product Variants')
@Controller('products')
export class ProductsVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}
  @Get('variants/best-seller')
  @Public()
  @ApiOperation({ summary: 'Get top best-selling variants' })
  @ApiResponse({
    status: 200,
    description: 'List of best-selling product variants',
    type: [ProductVariant],
  })
  public async bestSeller() {
    return this.productVariantService.getBestSeller();
  }
  @Get(':productId/variants')
  @Public()
  @ApiOperation({ summary: 'Get all variants for a product' })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'List of variants for the product' })
  public async findAllVariantForProduct(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.productVariantService.findAllProductVariant(productId);
  }
  @Get(':productId/variants/:variantId')
  @Public()
  @ApiOperation({ summary: 'Get a single variant by ID for a product' })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant ID',
    example: '660e8400-e29b-41d4-a716-446655440111',
  })
  @ApiResponse({ status: 200, description: 'Variant found' })
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
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a new variant for a product (upload files to Cloudinary)',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['images', 'color', 'size', 'stock'],
      properties: {
        size: { type: 'string', example: 'M' },
        color: { type: 'string', example: 'red' },
        stock: { type: 'number', example: 10 },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' }, // file picker in Swagger
        },
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant ID',
    example: '660e8400-e29b-41d4-a716-446655440111',
  })
  @ApiOperation({ summary: 'Edit a product variant by ID' })
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
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant ID',
    example: '660e8400-e29b-41d4-a716-446655440111',
  })
  @ApiOperation({ summary: 'Update product variant photos' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['images'],
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product variant by ID' })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'variantId',
    description: 'Variant ID',
    example: '660e8400-e29b-41d4-a716-446655440111',
  })
  @ApiResponse({ status: 200, description: 'Variant deleted successfully' })
  public async deleteProductVariantById(
    @Param() deleteProductVariantDto: DeleteProductVariantDto,
  ) {
    return this.productVariantService.deleteVariant(deleteProductVariantDto);
  }
}
