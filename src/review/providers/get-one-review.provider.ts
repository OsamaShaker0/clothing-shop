import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../review.entity';
import { Repository } from 'typeorm';
@Injectable()
export class GetOneReviewProvider {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}
  public async getOneReviewById(reviewId: string) {
    try {
      const review = await this.reviewRepository.findOne({
        where: { id: reviewId },
        relations: ['user'],
      });
      if (!review) {
        throw new NotFoundException(`Can not find review with id ${reviewId} `);
      }
      return review;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
}
