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
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './providers/product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { FindAllProductsDto } from './dtos/find-all-products.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { GetProductsByCategoryIdDto } from './dtos/get-products-by-category-id.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @UseGuards(AdminAccessOnlyGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  public async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.createProduct(createProductDto, files);
  }
  @Get()
  @Public()
  public async findAllProducts(
    @Query() findAllProductsDto: FindAllProductsDto,
  ) {
    return this.productService.getAllproducts(findAllProductsDto);
  }
  @Get(':id')
  @Public()
  public async findOneProducById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.getOneProductById(id);
  }
  @Get('category/:categoryId')
  @Public()
  public async getProductByCategory(
    @Param('categoryId', new ParseUUIDPipe()) categorId: string,
    @Query()
    getProductsByCategoryIdDto: GetProductsByCategoryIdDto,
  ) {
    return this.productService.getProductByCategory(
      categorId,
      getProductsByCategoryIdDto,
    );
  }
  @Patch(':id')
  @UseGuards(AdminAccessOnlyGuard)
  public async updateProductById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProductById(id, updateProductDto);
  }
  @Delete(':id')
  @UseGuards(AdminAccessOnlyGuard)
  public async deleteProductById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.deleteProductById(id);
  }
}
