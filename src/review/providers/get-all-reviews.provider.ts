import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetAllReviewsProvider {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}
  public async getAllReviewsForProduct(productId: string) {
    try {
      const [reviews, count] = await this.reviewRepository.findAndCount({
        where: { product: { id: productId } },
        relations: ['user'],
        order: { createdAt: 'DESC' },
        select: { id: true, comment: true, rating: true, user: true },
      });
      if (count == 0) {
        throw new NotFoundException('there are no reviews yet');
      }
      return { count, reviews };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
}
