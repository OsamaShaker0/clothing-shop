import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../cart-item.entity';
import { Admin, Repository } from 'typeorm';
import { RequestWithActor } from '../interfaces/request-actor.inteface';
import { Cart } from '../cart.entity';
import { UserRole } from 'src/user/enums/user-roles.enum';

@Injectable()
export class GetAllCartItemsProvider {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  public async findAllCartItems(request: RequestWithActor, cartId: string) {
    const actorId = request.actor.sub;

    let cart = await this.cartRepository.findOne({
      where: [
        { id: cartId, guestId: actorId },
        { id: cartId, user: { id: actorId } },
      ],
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      if (request.actor.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Cart not found or access denied');
      }
      cart = await this.cartRepository.findOneBy({ id: cartId });
    }

    return cart;
  }
}
