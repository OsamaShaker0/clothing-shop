import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import type { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { CartService } from 'src/cart/providers/cart.service';
@UseGuards(AdminAccessOnlyGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('carts-dashboard')
export class CartDashboardController {
  constructor(private readonly cartService: CartService) {}
  @Get()
  public async GetAllCartsForAdmin() {
    return this.cartService.getAllCartsForAdmin();
  }

  @Get('/:cartId')
  async getAllItmesInCart(
    @Req() request: RequestWithActor,
    @Param('cartId', new ParseUUIDPipe()) cartId: string,
  ) {
    return this.cartService.getAllItemsInOneCart(request, cartId);
  }
  @Delete('/:cartId')
  async deleteUserCart(@Param('cartId', new ParseUUIDPipe()) cartId: string) {
    return this.cartService.deleteUserCart(cartId);
  }
}
