import { Injectable } from '@nestjs/common';
import { CreateProductProvider } from './create-product.provider';
import { CreateProductDto } from '../dtos/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly craeteProductProvider: CreateProductProvider) {}

  public async createProduct(createProductDto: CreateProductDto) {
    return this.craeteProductProvider.createProduct(createProductDto);
  }
}
