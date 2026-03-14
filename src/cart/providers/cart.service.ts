import { Injectable } from '@nestjs/common';
import { AddItemToCartProvider } from './add-item-to-cart.provider';
import { AddItemToCartDto } from '../dtos/add-item-to-cart.dto';

import { GetAllCartItemsProvider } from './get-all-cart-items.provider';
import { DeleteCartItemProvider } from './delete-cart-item.provider';
import { RemoveOrDecreaseItemDto } from '../dtos/remove-or-decrease.dto';
import { DeleteAllItemsProvider } from './delete-all-items.provider';
import { DeleteUserCartProvider } from './delete-user-cart.provider';
import { RequestWithActor } from '../interfaces/request-actor.inteface';
import { CreateCartProvider } from './create-cart.provider';
import { GetAllCartsForAdminProvider } from './get-all-carts-for-admin.provider';
import { FindCurrentUserCartProvider } from './find-current-user-cart.provider';

@Injectable()
export class CartService {
  constructor(
    private readonly addItemToCartProvider: AddItemToCartProvider,

    private readonly getAllCartItemsProvider: GetAllCartItemsProvider,

    private readonly deleteCartItemProvider: DeleteCartItemProvider,

    private readonly deleteAllItemsProvider: DeleteAllItemsProvider,

    private readonly deleteUserCartProvider: DeleteUserCartProvider,

    private readonly getAllCartsForAdminProvider: GetAllCartsForAdminProvider,

    private readonly createCartProvider: CreateCartProvider,

    private readonly findCurrentUserCartProvider: FindCurrentUserCartProvider,
  ) {}

  public async findCuurentUserCart(request: RequestWithActor) {
    return await this.findCurrentUserCartProvider.getLoginUserCart(request);
  }
  public async getAllCartsForAdmin() {
    return await this.getAllCartsForAdminProvider.getAllCartsForAdmin();
  }

  public async createCart(request: RequestWithActor) {
    return this.createCartProvider.createCart(request);
  }
  public async addToCart(
    request: RequestWithActor,
    addItemToCartDto: AddItemToCartDto,
  ) {
    return this.addItemToCartProvider.addItemToCart(request, addItemToCartDto);
  }
  public getAllItemsInOneCart(request: RequestWithActor, cartId: string) {
    return this.getAllCartItemsProvider.findAllCartItems(request, cartId);
  }
  public removeOrDecreaseCartItem(
    id: string,
    request: RequestWithActor,
    removeOrDecreaseItemDto: RemoveOrDecreaseItemDto,
  ) {
    return this.deleteCartItemProvider.removeOrDecreaseItem(
      id,
      request,
      removeOrDecreaseItemDto,
    );
  }
  public async deleteAllItems(cartId: string) {
    return this.deleteAllItemsProvider.removeAllCartItems(cartId);
  }
  public async deleteUserCart(id: string) {
    return this.deleteUserCartProvider.deleteUserCart(id);
  }
}
