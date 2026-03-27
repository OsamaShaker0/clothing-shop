import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../review.entity';
import { Repository } from 'typeorm';
import { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';

@Injectable()
export class DeleteReviewProvider {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}
  public async deleteReviewById(reviewId: string, request: RequestWithActor) {
    try {
      const actorId = request.actor.sub;
      const review = await this.reviewRepository.findOne({
        where: { id: reviewId, user: { id: actorId } },
      });
      if (!review) {
        throw new NotFoundException(`Can not found review `);
      }
      await this.reviewRepository.remove(review);
      return { message: `review with id ${reviewId} deleted successfully` };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Something went wrong  , please try again',
      );
    }
  }
}
