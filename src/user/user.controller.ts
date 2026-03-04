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
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetAllUsersDto } from './dtos/get-all-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './enums/user-roles.enum';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly usersService: UsersService) {}
  @Get() // only admin
  @Roles(UserRole.ADMIN)
  public async findAllUsers(@Query() getAllUsersDto: GetAllUsersDto) {
    return this.usersService.getAllUsers(getAllUsersDto);
  }
  @Get(':id') // only admin
  @Roles(UserRole.ADMIN)
  public async findOneUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.getOneUserById(id);
  }
  @Get('/email:email')
  @Roles(UserRole.ADMIN)
  public async findOneUserByEmail(@Param('email') email: string) {
    return this.usersService.getOneUserByEmil(email);
  }

  @Post()
  @Roles(UserRole.ADMIN) // this route only admin can use it
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Patch(':id')
  @Roles(UserRole.ADMIN) // only admin or the user himself
  public async patchUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(id, updateUserDto);
  }
  @Delete(':id')
  @Roles(UserRole.ADMIN) // only admin or the user himself
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.deleteUserById(id);
  }
}
