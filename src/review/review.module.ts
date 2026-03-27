import { Module } from '@nestjs/common';
import { ReviewService } from './providers/review.service';
import { CreateReviewProvider } from './providers/create-review.provider';
import { UpdateReviewProvider } from './providers/update-review.provider';
import { DeleteReviewProvider } from './providers/delete-review.provider';
import { GetAllReviewsProvider } from './providers/get-all-reviews.provider';
import { GetOneReviewProvider } from './providers/get-one-review.provider';
import { ReviewController } from './review.controller';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';

@Module({
  providers: [
    ReviewService,
    CreateReviewProvider,
    UpdateReviewProvider,
    DeleteReviewProvider,
    GetAllReviewsProvider,
    GetOneReviewProvider,
  ],
  controllers: [ReviewController],
  imports: [TypeOrmModule.forFeature([Review]),UserModule, ProductModule],
})
export class ReviewModule {}
