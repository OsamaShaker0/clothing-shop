import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../cart.entity';
import { Repository } from 'typeorm';
import { RequestWithActor } from '../interfaces/request-actor.inteface';
import { ActorType } from '../enums/actor-type.enum';

@Injectable()
export class FindCurrentUserCartProvider {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  public async getLoginUserCart(request: RequestWithActor): Promise<Cart> {
    const actorType = request.actor.type;
    const actorId = request.actor.sub;

    let cart: Cart | null = null;

    try {
      if (actorType === ActorType.GUEST) {
        cart = await this.cartRepository.findOne({
          where: { guestId: actorId },
          relations: ['items'], 
        });
      } else if (actorType === ActorType.NORMAL_USER) {
        cart = await this.cartRepository.findOne({
          where: { userId: actorId },
          relations: ['items'],
        });
      } else {
        throw new NotFoundException(`Unknown actor type`);
      }

      if (!cart) {
        throw new NotFoundException(
          `Cart not found for actor with id ${actorId}`,
        );
      }

      return cart;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong, try again later',
      );
    }
  }
}
