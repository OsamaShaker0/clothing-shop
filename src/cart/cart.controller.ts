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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get or create a cart for current user/guest' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-guest-id',
    required: false,
    description: 'Guest user UUID (optional if logged in)',
    schema: { type: 'string', format: 'uuid' },
  })
  async getOrCreateCart(@Req() request: RequestWithActor) {
    return this.cartService.findCuurentUserCart(request);
  }

  @Get('current-user')
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, description: 'Current user cart retrieved' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-guest-id',
    required: false,
    description: 'Guest user UUID (optional if logged in)',
    schema: { type: 'string', format: 'uuid' },
  })
  async getCurrentUserCart(@Req() request: RequestWithActor) {
    return this.cartService.findCuurentUserCart(request);
  }

  @Get('all-carts')
  @UseGuards(AdminAccessOnlyGuard)
  @ApiOperation({ summary: 'Get all carts (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all carts' })
  @ApiBearerAuth()
  public async GetAllCartsForAdmin() {
    return this.cartService.getAllCartsForAdmin();
  }

  @Get(':cartId')
  @UseGuards(OwnerOrAdminGuard)
  @OwnerCheck({
    entity: Cart,
    param: 'id',
    ownerField: ['guestId', 'userId'],
  })
  @ApiOperation({ summary: 'Get all items in one cart' })
  @ApiResponse({ status: 200, description: 'Cart items retrieved' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-guest-id',
    required: false,
    description: 'Guest user UUID (optional if logged in)',
    schema: { type: 'string', format: 'uuid' },
  })
  async getAllItmesInCart(
    @Req() request: RequestWithActor,
    @Param('cartId', new ParseUUIDPipe()) cartId: string,
  ) {
    return this.cartService.getAllItemsInOneCart(request, cartId);
  }
  @Post('create-cart')
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiResponse({ status: 201, description: 'Cart created successfully' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-guest-id',
    required: false,
    description: 'Guest user UUID (optional if logged in)',
    schema: { type: 'string', format: 'uuid' },
  })
  public async createCart(@Req() request: RequestWithActor) {
    return this.cartService.createCart(request);
  }
  @Post('add-item')
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-guest-id',
    required: false,
    description: 'Guest user UUID (optional if logged in)',
    schema: { type: 'string', format: 'uuid' },
  })
  public async addItemmToCart(
    @Req() request: RequestWithActor,
    @Body() addItemToCartDto: AddItemToCartDto,
  ) {
    return await this.cartService.addToCart(request, addItemToCartDto);
  }

  @Delete('cart-item/:cartId')
  @ApiOperation({ summary: 'Remove or decrease an item from cart' })
  @ApiResponse({ status: 204, description: 'Item removed or decreased' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-guest-id',
    required: false,
    description: 'Guest user UUID (optional if logged in)',
    schema: { type: 'string', format: 'uuid' },
  })
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
  @Delete(':cartId')
  @UseGuards(OwnerOrAdminGuard)
  @OwnerCheck({
    entity: Cart,
    param: 'id',
    ownerField: ['guestId', 'userId'],
  })
  @ApiOperation({ summary: 'Delete a user cart' })
  @ApiResponse({ status: 204, description: 'Cart deleted successfully' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-guest-id',
    required: false,
    description: 'Guest user UUID (optional if logged in)',
    schema: { type: 'string', format: 'uuid' },
  })
  async deleteUserCart(@Param('cartId', new ParseUUIDPipe()) cartId: string) {
    return this.cartService.deleteUserCart(cartId);
  }

  @Delete('/all-items/:cartId')
  @UseGuards(OwnerOrAdminGuard)
  @OwnerCheck({
    entity: Cart,
    param: 'cartId',
    ownerField: ['guestId', 'userId'],
  })
  @ApiOperation({ summary: 'Delete all items in a cart' })
  @ApiResponse({ status: 204, description: 'All items deleted successfully' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-guest-id',
    required: false,
    description: 'Guest user UUID (optional if logged in)',
    schema: { type: 'string', format: 'uuid' },
  })
  async deleteAllItems(@Param('cartId', new ParseUUIDPipe()) cartId: string) {
    return this.cartService.deleteAllItems(cartId);
  }
}
