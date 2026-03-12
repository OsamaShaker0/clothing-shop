import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../cart-item.entity';
import { Repository } from 'typeorm';
import { Cart } from '../cart.entity';
import { RemoveOrDecreaseItemDto } from '../dtos/remove-or-decrease.dto';
import { RequestWithActor } from '../interfaces/request-actor.inteface';

@Injectable()
export class DeleteCartItemProvider {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}
  public async removeOrDecreaseItem(
    cartId: string,
    request: RequestWithActor,
    removeOrDecreaseItemDto: RemoveOrDecreaseItemDto,
  ) {
    try {
      const actor = request.actor;
      const cart = await this.cartRepository.findOneBy({ id: cartId });
      if (!cart) {
        throw new NotFoundException(`Can not found cart with id ${cartId}`);
      }

      if (cart.userId) {
        if (cart.userId !== actor.sub) {
          throw new ForbiddenException('Not Allowed');
        }
      }
      if (cart.guestId) {
        if (cart.guestId !== actor.sub) {
          throw new ForbiddenException('Not Allowed');
        }
      }

      const cartItem = await this.cartItemRepository.findOne({
        where: {
          id: removeOrDecreaseItemDto.cartItemId,
          cart: { id: cartId },
        },
        relations: ['cart'],
      });

      if (!cartItem) {
        throw new NotFoundException(
          `Cart item with id ${removeOrDecreaseItemDto.cartItemId} not found in cart ${cartId}`,
        );
      }

      if (cartItem.quantity <= 1) {
        await this.cartItemRepository.remove(cartItem);
        return { message: 'Cart item removed completely' };
      } else {
        cartItem.quantity -= 1;
        await this.cartItemRepository.save(cartItem);
        return {
          message: 'Cart item quantity decreased by 1',
          cartItem,
        };
      }
    } catch (error) {
      console.error(error);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;

      throw new InternalServerErrorException(
        'something went wrong , please try again',
      );
    }
  }
}
