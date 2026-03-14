import { PartialType } from '@nestjs/swagger';
import { EditProductVariantDto } from './edit-product-variant.dto';

export class DeleteProductVariantDto extends PartialType(
  EditProductVariantDto,
) {}
