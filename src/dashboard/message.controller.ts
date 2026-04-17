import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import messagesConfig from 'src/config/messages.config';
import { MessageDto } from './dtos/message.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(
    @Inject(messagesConfig.KEY)
    private readonly messageConfig: ConfigType<typeof messagesConfig>,
  ) {}
  @UseGuards(AdminAccessOnlyGuard)
   @ApiBearerAuth() 
  @Post()
  @ApiOperation({ summary: 'Display or return a message' })
  @ApiBody({ type: MessageDto })
  @ApiResponse({
    status: 201,
    description: 'Returns the provided message or default config message',
    schema: {
      example: 'Hello world',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  public async displayMessage(@Body() messageDto: MessageDto) {
    if (!messageDto.msg) return this.messageConfig.content;
    return messageDto.msg;
  }
}
