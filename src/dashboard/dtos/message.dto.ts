import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MessageDto {
  @ApiPropertyOptional({
    description: 'Optional message text',
    example: 'Hello world',
  })
  @IsOptional()
  @IsString()
  msg: string;
}
