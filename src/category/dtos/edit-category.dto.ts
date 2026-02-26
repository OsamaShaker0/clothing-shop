import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EditCategoryDto extends PartialType(CreateCategoryDto) {

}
