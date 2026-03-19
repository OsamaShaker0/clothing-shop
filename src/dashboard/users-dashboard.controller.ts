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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { GetAllUsersDto } from 'src/user/dtos/get-all-users.dto';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { UsersService } from 'src/user/providers/users.service';

@ApiTags('Users Dashboard')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AdminAccessOnlyGuard)
@Controller('users-dashboard')
export class UsersDashboardController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @ApiOperation({ summary: 'Get all users (with filters & pagination)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  public async findAllUsers(@Query() getAllUsersDto: GetAllUsersDto) {
    return this.usersService.getAllUsers(getAllUsersDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  public async findOneUserById(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.usersService.getOneUserById(userId);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({ name: 'email', type: 'string', example: 'user@email.com' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  public async findOneUserByEmail(@Param('email') email: string) {
    return this.usersService.getOneUserByEmil(email);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Patch(':userId')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  public async patchUserById(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(userId, updateUserDto);
  }
  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUserById(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.usersService.deleteUserById(userId);
  }
}
