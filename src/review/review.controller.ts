import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from './providers/review.service';
import { Public } from 'src/auth/decorators/public.decorator';
import type { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { CreateReviewDto } from './dtos/create-review.dto';
import { OwnerOrAdminGuard } from 'src/auth/guards/owner-admin.guard';
import { OwnerCheck } from 'src/auth/decorators/owner-check.decorator';
import { Review } from './review.entity';
import { PatchReviewDto } from './dtos/patch-review.dto';

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Reviews')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('product/:productId')
  @Public()
  @ApiOperation({ summary: 'Get all reviews for a product' })
  @ApiParam({ name: 'productId', type: 'string', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'List of reviews returned' })
  public async getAllReviewsForProduct(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.reviewService.getAllReviewsForProduct(productId);
  }
  @Get(':reviewId')
  @Public()
  @ApiOperation({ summary: 'Get one review by ID' })
  @ApiParam({ name: 'reviewId', type: 'string', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Review returned' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  public async getOneReview(
    @Param('reviewId', new ParseUUIDPipe()) reviewId: string,
  ) {
    return this.reviewService.getOneReviewById(reviewId);
  }

  @Post(':productId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review for a product' })
  @ApiParam({ name: 'productId', type: 'string', example: 'uuid' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  public async createReview(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Req() request: RequestWithActor,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.createReview(productId, request, createReviewDto);
  }
  @Patch(':reviewId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review (owner or admin)' })
  @ApiParam({ name: 'reviewId', type: 'string', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @UseGuards(OwnerOrAdminGuard)
  @OwnerCheck({
    entity: Review,
    param: 'reviewId',
    ownerField: 'userId',
  })
  public async updateReview(
    @Param('reviewId', new ParseUUIDPipe()) reviewId: string,
    @Req() request: RequestWithActor,
    @Body() patchReviewDto: PatchReviewDto,
  ) {
    return this.reviewService.updateReviewForProduct(
      reviewId,
      request,
      patchReviewDto,
    );
  }

  @Delete(':reviewId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review (owner or admin)' })
  @ApiParam({ name: 'reviewId', type: 'string', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @UseGuards(OwnerOrAdminGuard)
  @OwnerCheck({
    entity: Review,
    param: 'reviewId',
    ownerField: 'userId',
  })
  public async deleteReview(
    @Param('reviewId', new ParseUUIDPipe()) reviewId: string,
    @Req() request: RequestWithActor,
  ) {
    return this.reviewService.deleteReview(reviewId, request);
  }
}
