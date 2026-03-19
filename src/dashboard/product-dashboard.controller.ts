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
import { CreateProductDto } from 'src/product/dtos/create-product.dto';
import { UpdateProductDto } from 'src/product/dtos/update-product.dto';
import { ProductService } from 'src/product/providers/product.service';

@ApiTags('Products Dashboard')
@ApiBearerAuth()
@UseGuards(AdminAccessOnlyGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('products-dashboard')
export class ProductDashboardController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create product with images' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @UseInterceptors(FilesInterceptor('images', 5))
  public async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.createProduct(createProductDto, files);
  }
  @Patch('/:productId')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'productId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  public async updateProductById(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProductById(productId, updateProductDto);
  }
  @Patch('/add-discount/:productId')
  @ApiOperation({ summary: 'Add discount to product and its variants' })
  @ApiParam({ name: 'productId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        discountPrecentage: { type: 'number', example: 20 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Discount applied successfully' })
  public async addDiscountForProductAndVariants(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body('discountPrecentage') discountPrecentage: number,
  ) {
    return this.productService.addDiscountForProductAndVariants(
      productId,
      discountPrecentage,
    );
  }
  @Delete('/delete-discount/:productId')
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'productId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  public async deleteDiscountForProductAndVariants(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.productService.removeDiscountForProductAndVariants(productId);
  }
  @Delete('/:productId')
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'productId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  public async deleteProductById(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.productService.deleteProductById(productId);
  }
}
