import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteUserCartProvider {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  public async deleteUserCart(id: string) {
    try {
      let cart = await this.cartRepository.findOneBy({ id });
      if (!cart) {
        throw new NotFoundException(`Cart with id ${id} not found`);
      }
      await this.cartRepository.remove(cart);
      return { message: `cart with id ${id} deleted succefully` };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'something went wrong , please try again',
      );
    }
  }
}
