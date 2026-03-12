import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetAllCartsForAdminProvider {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}
  public async getAllCartsForAdmin() {
    try {
      return await this.cartRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong please try later',
      );
    }
  }
}
