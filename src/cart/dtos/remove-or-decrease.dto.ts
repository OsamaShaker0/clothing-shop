import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveOrDecreaseItemDto {
  @IsNotEmpty()
  @IsUUID()
  cartItemId: string;
}
