import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartProvider } from './create-cart.provider';

import { ProductService } from 'src/product/providers/product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../cart-item.entity';
import { Repository } from 'typeorm';
import { Cart } from '../cart.entity';
import { AddItemToCartDto } from '../dtos/add-item-to-cart.dto';
import { RequestWithActor } from '../interfaces/request-actor.inteface';

@Injectable()
export class AddItemToCartProvider {
  constructor(
    private readonly createCartProvider: CreateCartProvider,

    private readonly productService: ProductService,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  public async addItemToCart(
    request: RequestWithActor,
    addItemToCartDto: AddItemToCartDto,
  ) {
    let cart: Cart = await this.createCartProvider.createCart(request);
    try {
      const product = await this.productService.getOneProductById(
        addItemToCartDto.productId,
      );
      let cartItem = await this.cartItemRepository.findOne({
        where: { cart: { id: cart.id }, product: { id: product.id } },
      });
      if (cartItem) {
        cartItem.quantity =
          cartItem.quantity + (addItemToCartDto.quantity ?? 1);
      } else {
        cartItem = this.cartItemRepository.create({
          cart,
          cartId: cart.id,
          product,
          productId: product.id,
          price: product.price,
          quantity: addItemToCartDto.quantity ?? 1,
        });
      }
      await this.cartItemRepository.save(cartItem);

      const updatedCart = await this.cartRepository.findOne({
        where: { id: cart.id },
        relations: ['items', 'items.product'],
      });

      return updatedCart;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Something went wrong, try again');
    }
  }
}
