import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from '../cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../cart-item.entity';

@Injectable()
export class DeleteAllItemsProvider {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}
  public async removeAllCartItems(cartId: string) {
    try {
      const cart: Cart | null = await this.cartRepository.findOne({
        where: { id: cartId },
        relations: ['items'],
      });

      if (!cart) {
        throw new NotFoundException(`Cannot find cart with id ${cartId}`);
      }

      if (!cart.items || cart.items.length === 0) {
        return { message: `There are no items in the cart` };
      }

      await this.cartItemRepository.delete({ cartId: cart.id });

      return { message: 'All items deleted successfully' };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'something went wrong , try again later',
      );
    }
  }
}
