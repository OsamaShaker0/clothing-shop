import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../review.entity';
import { Repository } from 'typeorm';
import { GetOneProductProvider } from 'src/product/providers/get-one-product.provider';
import { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { UsersService } from 'src/user/providers/users.service';

@Injectable()
export class CreateReviewProvider {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly usersService: UsersService,
    private readonly getOneProductProvider: GetOneProductProvider,
  ) {}

  public async createReviewForProduct(
    productId: string,
    request: RequestWithActor,
    createReviewDto: CreateReviewDto,
  ) {
    try {
      const actorId = request.actor.sub;

      const product =
        await this.getOneProductProvider.getOneProductById(productId);

      const user = await this.usersService.getOneUserById(actorId);

      const existingReview = await this.reviewRepository.findOne({
        where: {
          product: { id: productId },
          user: { id: actorId },
        },
      });

      if (existingReview) {
        throw new BadRequestException(
          'You already created a review for this product',
        );
      }

      let review = this.reviewRepository.create({
        ...createReviewDto,
        product,
        user,
        userId: user.id,
      });

      review = await this.reviewRepository.save(review);

      return review;
    } catch (error) {
      console.error(error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Something went wrong, please try again',
      );
    }
  }
}
