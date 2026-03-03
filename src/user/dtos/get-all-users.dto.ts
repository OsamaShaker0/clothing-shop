import { PartialType } from '@nestjs/swagger';
import { FindCategoryDto } from 'src/category/dtos/find-all-query.dto';

export class GetAllUsersDto extends PartialType(FindCategoryDto) {}
