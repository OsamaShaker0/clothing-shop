import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../review.entity';
import { Repository } from 'typeorm';
import { PatchReviewDto } from '../dtos/patch-review.dto';
import { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
@Injectable()
export class UpdateReviewProvider {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}
  public async patchReview(
    reviewId: string,
    request: RequestWithActor,

    patchReviewDto: PatchReviewDto,
  ) {
    try {
      const actorId = request.actor.sub;
      const review = await this.reviewRepository.findOne({
        where: { id: reviewId, user: { id: actorId } },
      });
      if (!review) {
        throw new NotFoundException(`Can not found review `);
      }
      const updated = this.reviewRepository.merge(review, patchReviewDto);
      const savedReview = await this.reviewRepository.save(updated);
      return savedReview;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Something went wrong  , please try again',
      );
    }
  }
}
