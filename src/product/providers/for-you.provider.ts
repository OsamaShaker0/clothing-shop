import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { Repository } from 'typeorm';
import { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { CartService } from 'src/cart/providers/cart.service';
import { ActorType } from 'src/cart/enums/actor-type.enum';
import { UsersService } from 'src/user/providers/users.service';
import { GenderEnum } from '../enums/product-gender.enum';
import { CartModule } from 'src/cart/cart.module';

@Injectable()
export class ForYouProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
        @Inject(forwardRef(()=>CartService))
    private readonly cartService: CartService,
   
    private readonly userService: UsersService,
  ) {}

  public async forYouProduct(request: RequestWithActor) {
    try {
      const actorType = request.actor.type;
      const actorId = request.actor.sub;
      const cart = await this.cartService.findCuurentUserCart(request);
      if (cart && cart.items.length) {
        const itemsLenght = cart.items.length;
        const lastItem = cart.items[itemsLenght - 1];
        const category = lastItem.product.category;
        return await this.productRepository.find({
          where: { category: category },
          take: 10,
        });
      } else if (actorType === ActorType.NORMAL_USER) {
        const user = await this.userService.getOneUserById(actorId);
        return await this.productRepository.find({
          where: { gender: user.gender as unknown as GenderEnum },
          take: 10,
        });
      }
      return await this.productRepository.find({
        take: 10,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to load recommended products',
      );
    }
  }
}
