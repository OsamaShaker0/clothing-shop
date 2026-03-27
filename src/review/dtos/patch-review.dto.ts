import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

export class PatchReviewDto extends PartialType(CreateReviewDto) {}
