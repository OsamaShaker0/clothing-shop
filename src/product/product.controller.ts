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
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './providers/product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { GetProductsByCategoryIdDto } from './dtos/get-products-by-category-id.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { PaginationQueryDto } from 'src/utils/pagination/dto/pagination-query.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from './product.entity';
import type { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @UseGuards(AdminAccessOnlyGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiOperation({ summary: 'Create a product (admin only)' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  public async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.createProduct(createProductDto, files);
  }
  @Get()
  @Public()
  @ApiOperation({ summary: 'List all products with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'ASC',
  })
  @ApiQuery({ name: 'name', required: false, example: 'first one' })
  @ApiQuery({ name: 'gender', required: false, example: 'male' })
  @ApiQuery({ name: 'minPrice', required: false, example: 10 })
  @ApiQuery({ name: 'maxPrice', required: false, example: 100 })
  @ApiResponse({ status: 200, description: 'List of products with pagination' })
  public async findAllProducts(
    @Req() req: Request,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.productService.getAllproducts(req, paginationQueryDto);
  }

  @Get('spinner')
  @Public()
  @ApiOperation({ summary: 'Get a random product (spinner)' })
  @ApiResponse({
    status: 200,
    description: 'Random product retrieved successfully',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'No products found',
  })
  public async getProductByLuck() {
    return this.productService.getOneProductByLuck();
  }
  @Get('for-you')
  @Public()
  @ApiOperation({ summary: 'Get personalized product recommendations' })
  @ApiResponse({
    status: 200,
    description: 'Recommended products retrieved successfully',
    type: [Product],
  })
  public async getProductsForYou(@Req() request: RequestWithActor) {
    return this.productService.getProductsForYou(request);
  }
  @Get('new-arrivals')
  @Public()
  @ApiOperation({ summary: 'Get latest products added in the last N days' })
  @ApiResponse({
    status: 200,
    description: 'List of newly added products',
    type: [Product],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  public async getNewarrivalsProducts() {
    return this.productService.getNewArraivalsProducts();
  }
  @Get('offers')
  @Public()
  public async getAllOffers() {
    return this.productService.getAllOffers();
  }
  @Get(':productId')
  @Public()
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Product found' })
  public async findOneProducById(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.productService.getOneProductById(productId);
  }
  @Get('category/:categoryId')
  @Public()
  @ApiOperation({ summary: 'Get products by category' })
  @ApiParam({
    name: 'categoryId',
    description: 'Category ID',
    example: '660e8400-e29b-41d4-a716-446655440111',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
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
  @Patch(':productId')
  @UseGuards(AdminAccessOnlyGuard)
  @ApiOperation({ summary: 'Update a product (admin only)' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  public async updateProductById(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProductById(productId, updateProductDto);
  }
  @Delete(':productId')
  @UseGuards(AdminAccessOnlyGuard)
  @ApiOperation({ summary: 'Delete a product (admin only)' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  public async deleteProductById(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.productService.deleteProductById(productId);
  }
}
