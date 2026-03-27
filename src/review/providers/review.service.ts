import { Injectable } from '@nestjs/common';
import { CreateReviewProvider } from './create-review.provider';
import { GetAllReviewsProvider } from './get-all-reviews.provider';
import { GetOneReviewProvider } from './get-one-review.provider';
import { UpdateReviewProvider } from './update-review.provider';
import { DeleteReviewProvider } from './delete-review.provider';
import { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { PatchReviewDto } from '../dtos/patch-review.dto';
import { retry } from 'rxjs';

@Injectable()
export class ReviewService {
  constructor(
    private readonly createReviewProvider: CreateReviewProvider,

    private readonly getAllReviewsProvider: GetAllReviewsProvider,

    private readonly getOneReviewProvider: GetOneReviewProvider,

    private readonly updateReviewProvider: UpdateReviewProvider,

    private readonly deleteReviewProvider: DeleteReviewProvider,
  ) {}

  public async createReview(
    productId: string,
    request: RequestWithActor,
    createReviewDto: CreateReviewDto,
  ) {
    return this.createReviewProvider.createReviewForProduct(
      productId,
      request,
      createReviewDto,
    );
  }

  public async getAllReviewsForProduct(productId: string) {
    return this.getAllReviewsProvider.getAllReviewsForProduct(productId);
  }

  public async getOneReviewById(reviewId: string) {
    return this.getOneReviewProvider.getOneReviewById(reviewId);
  }

  public async updateReviewForProduct(
    reviewId: string,
    request: RequestWithActor,
    patchReviewDto: PatchReviewDto,
  ) {
    return this.updateReviewProvider.patchReview(
      reviewId,
      request,
      patchReviewDto,
    );
  }
  public async deleteReview(reviewId: string, request: RequestWithActor) {
    return this.deleteReviewProvider.deleteReviewById(reviewId, request);
  }
}
