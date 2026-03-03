import {
  Body,
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
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetAllUsersDto } from './dtos/get-all-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}
  @Get() // only admin
  public async findAllUsers(@Query() getAllUsersDto: GetAllUsersDto) {
    return this.usersService.getAllUsers(getAllUsersDto);
  }
  @Get(':id') // only admin
  public async findOneUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.getOneUserById(id);
  }

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Patch(':id') // only admin or the user himself 
  public async patchUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(id, updateUserDto);
  }
   @Delete(':id') // only admin or the user himself 
   @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
   
  ) {
    return this.usersService.deleteUserById(id);

  }
  
}
