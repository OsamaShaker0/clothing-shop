import { Injectable } from '@nestjs/common';
import { CreateProductProvider } from './create-product.provider';
import { CreateProductDto } from '../dtos/create-product.dto';
import { GetOneProductProvider } from './get-one-product.provider';
import { UpdateProductProvider } from './update-product.provider';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { DeleteProductProvider } from './delete-product.provider';
import { GetProductsByCategoryIdProvider } from './get-products-by-category-id.provider';
import { GetProductsByCategoryIdDto } from '../dtos/get-products-by-category-id.dto';
import { PaginationQueryDto } from 'src/utils/pagination/dto/pagination-query.dto';
import { Product } from '../product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { queryWithPagination } from 'src/utils/pagination/query-builder';
import { DiscountProvider } from './discount.provider';
import { NewArrivalsProvider } from './new-arrivals.provider';
import { OffersAndDiscountsProvider } from './offers-and-discounts.provider';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly createProductProvider: CreateProductProvider,
    private readonly getOneProductProvider: GetOneProductProvider,
    private readonly updateProductProvider: UpdateProductProvider,
    private readonly deleteProductProvider: DeleteProductProvider,
    private readonly getProductsByCatgeoryIdProvider: GetProductsByCategoryIdProvider,
    private readonly discountProvider: DiscountProvider,
    private readonly newArrivalsProvider: NewArrivalsProvider,
    private readonly getAllOffersProvider: OffersAndDiscountsProvider,
  ) {}
  public async getNewArraivalsProducts() {
    return this.newArrivalsProvider.newArrivals();
  }
  public async getAllOffers() {
    return this.getAllOffersProvider.getAllOffers();
  }
  public async createProduct(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    return this.createProductProvider.createProduct(createProductDto, files);
  }
  public async getAllproducts(request, paginationQueryDto: PaginationQueryDto) {
    return queryWithPagination(
      request,
      this.productRepository,
      paginationQueryDto,
    );
  }
  public async getOneProductById(id: string) {
    return this.getOneProductProvider.getOneProductById(id);
  }
  public async updateProductById(
    id: string,
    updateProductDto: UpdateProductDto,
  ) {
    return this.updateProductProvider.updateProduct(id, updateProductDto);
  }
  public async deleteProductById(id: string) {
    return this.deleteProductProvider.deleteProductById(id);
  }
  public async getProductByCategory(
    categoryId: string,
    getProductsByCatgeoryIdDto: GetProductsByCategoryIdDto,
  ) {
    return this.getProductsByCatgeoryIdProvider.getProductsByCategory(
      categoryId,
      getProductsByCatgeoryIdDto,
    );
  }
  public async addDiscountForProductAndVariants(
    prosuctId: string,
    discountPercentage: number,
  ) {
    return this.discountProvider.addDiscountForProductAndVariants(
      prosuctId,
      discountPercentage,
    );
  }
  public async removeDiscountForProductAndVariants(prosuctId: string) {
    return this.discountProvider.removeDiscountFromProductAndVariants(
      prosuctId,
    );
  }
}
