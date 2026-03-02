import { Injectable } from '@nestjs/common';
import { CreateProductProvider } from './create-product.provider';
import { CreateProductDto } from '../dtos/create-product.dto';
import { GetProductsProvider } from './get-products.provider';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';
import { GetOneProductProvider } from './get-one-product.provider';
import { UpdateProductProvider } from './update-product.provider';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { DeleteProductProvider } from './delete-product.provider';
import { GetProductsByCategoryIdProvider } from './get-products-by-category-id.provider';
import { GetProductsByCategoryIdDto } from '../dtos/get-products-by-category-id.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly createProductProvider: CreateProductProvider,
    private readonly getAllProductsProvider: GetProductsProvider,
    private readonly getOneProductProvider: GetOneProductProvider,
    private readonly updateProductProvider: UpdateProductProvider,
    private readonly deleteProductProvider: DeleteProductProvider,
    private readonly getProductsByCatgeoryIdProvider: GetProductsByCategoryIdProvider,
  ) {}

  public async createProduct(createProductDto: CreateProductDto , files : Express.Multer.File[]) {
    return this.createProductProvider.createProduct(createProductDto , files);
  }
  public async getAllproducts(findAllProductsDto: FindAllProductsDto) {
    return this.getAllProductsProvider.getAllProducts(findAllProductsDto);
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
}
