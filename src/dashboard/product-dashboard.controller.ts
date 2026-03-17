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
import { CreateProductDto } from 'src/product/dtos/create-product.dto';
import { UpdateProductDto } from 'src/product/dtos/update-product.dto';
import { ProductService } from 'src/product/providers/product.service';
@UseGuards(AdminAccessOnlyGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('products-dashboard')
export class ProductDashboardController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  public async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.createProduct(createProductDto, files);
  }
  @Patch('/:productId')
  public async updateProductById(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProductById(productId, updateProductDto);
  }
  @Delete('/:productId')
  public async deleteProductById(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.productService.deleteProductById(productId);
  }
}
