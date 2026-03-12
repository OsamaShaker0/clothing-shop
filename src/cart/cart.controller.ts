import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AddItemToCartDto } from './dtos/add-item-to-cart.dto';
import { CartService } from './providers/cart.service';

import { RemoveOrDecreaseItemDto } from './dtos/remove-or-decrease.dto';
import type { RequestWithActor } from './interfaces/request-actor.inteface';
import { OwnerOrAdminGuard } from 'src/auth/guards/owner-admin.guard';
import { OwnerCheck } from 'src/auth/decorators/owner-check.decorator';
import { Cart } from './cart.entity';

import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
@UseInterceptors(ClassSerializerInterceptor)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getOrCreateCart(@Req() request: RequestWithActor) {
    return this.cartService.findCuurentUserCart(request);
  }

  @Get('current-user')
  async getCurrentUserCart(@Req() request: RequestWithActor) {
    return this.cartService.findCuurentUserCart(request);
  }

  @Get('all-carts')
  @UseGuards(AdminAccessOnlyGuard)
  public async GetAllCartsForAdmin() {
    return this.cartService.getAllCartsForAdmin();
  }

  @Get(':id')
  @UseGuards(OwnerOrAdminGuard)
  @OwnerCheck({
    entity: Cart,
    param: 'id',
    ownerField: ['guestId', 'userId'],
  })
  async getAllItmesInCart(
    @Req() request: RequestWithActor,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.cartService.getAllItemsInOneCart(request, id);
  }
  @Post('create-cart')
  public async createCart(@Req() request: RequestWithActor) {
    return this.cartService.createCart(request);
  }
  @Post('add-item')
  public async addItemmToCart(
    @Req() request: RequestWithActor,
    @Body() addItemToCartDto: AddItemToCartDto,
  ) {
    return await this.cartService.addToCart(request, addItemToCartDto);
  }

  @Delete('cart-item/:cartId')
  async deleteItemFromCart(
    @Param('cartId', new ParseUUIDPipe()) cartId: string,
    @Req() request: RequestWithActor,
    @Body() removeOrDecreaseItemDto: RemoveOrDecreaseItemDto,
  ) {
    return this.cartService.removeOrDecreaseCartItem(
      cartId,
      request,
      removeOrDecreaseItemDto,
    );
  }
  @Delete(':id')
  @UseGuards(OwnerOrAdminGuard)
  @OwnerCheck({
    entity: Cart,
    param: 'id',
    ownerField: ['guestId', 'userId'],
  })
  async deleteUserCart(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.cartService.deleteUserCart(id);
  }

  @Delete('/all-items/:cartId')
  @UseGuards(OwnerOrAdminGuard)
  @OwnerCheck({
    entity: Cart,
    param: 'cartId',
    ownerField: ['guestId', 'userId'],
  })
  async deleteAllItems(@Param('cartId', new ParseUUIDPipe()) cartId: string) {
    return this.cartService.deleteAllItems(cartId);
  }
}
