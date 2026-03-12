import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../cart.entity';

import { UsersService } from 'src/user/providers/users.service';

import { RequestWithActor } from '../interfaces/request-actor.inteface';
import { ActorType } from '../enums/actor-type.enum';

@Injectable()
export class CreateCartProvider {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    private readonly userService: UsersService,
  ) {}

  public async findCart(request: RequestWithActor) {
    const actor = request.actor;
    const actorType = request.actor?.type;
    let cart: Cart | null = null;

    if (actorType === ActorType.GUEST) {
      cart = await this.cartRepository.findOneBy({ guestId: actor.sub });

      return cart;
    }
    if (actorType === ActorType.NORMAL_USER) {
      cart = await this.cartRepository.findOneBy({ user: { id: actor.sub } });
      return cart;
    }
    return null;
  }

  public async createCart(request: RequestWithActor) {
    let cart = await this.findCart(request);
    if (cart) return cart;
    try {
      const actorId = request.actor.sub;
      const actorType = request.actor.type;
      if (cart) {
        throw new BadRequestException('user has already cart');
      }
      if (actorType === ActorType.NORMAL_USER) {
        const user = await this.userService.getOneUserById(actorId);
        cart = this.cartRepository.create({ user, userId: user.id });
        cart = await this.cartRepository.save(cart);
        return cart;
      }
      if (actorType === ActorType.GUEST) {
        cart = this.cartRepository.create({ guestId: actorId });
        cart = await this.cartRepository.save(cart);
        return cart;
      }
      throw new BadRequestException('Invalid actor type');
    } catch (error) {
      console.error(error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        'Something went wrong please try again',
      );
    }
  }
}
