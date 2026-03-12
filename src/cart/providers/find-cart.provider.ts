import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindCartProvider {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  public async findCartById(id: string) {
    try {
      const cart = await this.cartRepository.findOneBy({ id });
      if (!cart) {
        throw new NotFoundException(`Cart with id  ${id} not found`);
      }
      return cart;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
}
