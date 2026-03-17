import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { GetAllUsersDto } from 'src/user/dtos/get-all-users.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { UsersService } from 'src/user/providers/users.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AdminAccessOnlyGuard)
@Controller('users-dashboard')
export class UsersDashboardController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  public async findAllUsers(@Query() getAllUsersDto: GetAllUsersDto) {
    return this.usersService.getAllUsers(getAllUsersDto);
  }

  @Get(':userId')
  @UseGuards(AdminAccessOnlyGuard)
  public async findOneUserById(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.usersService.getOneUserById(userId);
  }

  @Get('email/:email')
  public async findOneUserByEmail(@Param('email') email: string) {
    return this.usersService.getOneUserByEmil(email);
  }

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Patch(':userId')
  public async patchUserById(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(userId, updateUserDto);
  }
  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUserById(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.usersService.deleteUserById(userId);
  }
}
