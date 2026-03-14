import { PartialType } from '@nestjs/swagger';
import { FindOneVariantForProductDto } from './find-one-variant-for-product.dto';

export class EditProductVariantDto extends PartialType(
  FindOneVariantForProductDto,
) {}
