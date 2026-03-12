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
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetAllUsersDto } from './dtos/get-all-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { OwnerOrAdminGuard } from 'src/auth/guards/owner-admin.guard';
import { OwnerCheck } from 'src/auth/decorators/owner-check.decorator';

import { Users } from './users.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @UseGuards(AdminAccessOnlyGuard)
  public async findAllUsers(@Query() getAllUsersDto: GetAllUsersDto) {
    return this.usersService.getAllUsers(getAllUsersDto);
  }
  @Get(':id')
  @UseGuards(AdminAccessOnlyGuard)
  public async findOneUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.getOneUserById(id);
  }
  @Get('/email:email')
  @UseGuards(AdminAccessOnlyGuard)
  public async findOneUserByEmail(@Param('email') email: string) {
    return this.usersService.getOneUserByEmil(email);
  }

  @Post()
  @UseGuards(AdminAccessOnlyGuard)
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Patch(':id')
  @UseGuards(OwnerOrAdminGuard)
  @OwnerCheck({
    entity: Users,
    param: 'id',
    ownerField: 'id',
  })
  public async patchUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(id, updateUserDto);
  }
  @Delete(':id')
  @UseGuards(OwnerOrAdminGuard)
  @OwnerCheck({
    entity: Users,
    param: 'id',
    ownerField: 'id',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.deleteUserById(id);
  }
}
