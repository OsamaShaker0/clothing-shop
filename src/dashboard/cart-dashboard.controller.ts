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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import type { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { CartService } from 'src/cart/providers/cart.service';

@ApiTags('Carts Dashboard')
@ApiBearerAuth()
@UseGuards(AdminAccessOnlyGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('carts-dashboard')
export class CartDashboardController {
  constructor(private readonly cartService: CartService) {}
  @Get('all-carts')
  @ApiOperation({ summary: 'Get all carts (Admin)' })
  @ApiResponse({ status: 200, description: 'List of all carts' })
  public async GetAllCartsForAdmin() {
    return this.cartService.getAllCartsForAdmin();
  }

  @Get('/:cartId')
  @ApiOperation({ summary: 'Get all items in a specific cart' })
  @ApiParam({ name: 'cartId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cart items retrieved' })
  async getAllItmesInCart(
    @Req() request: RequestWithActor,
    @Param('cartId', new ParseUUIDPipe()) cartId: string,
  ) {
    return this.cartService.getAllItemsInOneCart(request, cartId);
  }
  @Delete('/:cartId')
  @ApiOperation({ summary: 'Delete a user cart' })
  @ApiParam({ name: 'cartId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cart deleted successfully' })
  async deleteUserCart(@Param('cartId', new ParseUUIDPipe()) cartId: string) {
    return this.cartService.deleteUserCart(cartId);
  }
}
