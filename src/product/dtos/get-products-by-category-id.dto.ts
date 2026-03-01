import { PartialType } from "@nestjs/swagger";
import { FindAllProductsDto } from "./find-all-products.dto";

export class GetProductsByCategoryIdDto extends PartialType(FindAllProductsDto){}