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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @UseGuards(AdminAccessOnlyGuard)
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiResponse({ status: 200, description: 'List of users', type: [Users] })
  public async findAllUsers(@Query() getAllUsersDto: GetAllUsersDto) {
    return this.usersService.getAllUsers(getAllUsersDto);
  }
  @Get(':id')
  @UseGuards(AdminAccessOnlyGuard)
  @ApiOperation({ summary: 'Get a user by ID (admin only)' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'The user', type: Users })
  @ApiResponse({ status: 404, description: 'User not found' })
  public async findOneUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.getOneUserById(id);
  }
  @Get('/email/:email')
  @UseGuards(AdminAccessOnlyGuard)
  @ApiOperation({ summary: 'Get a user by email (admin only)' })
  @ApiParam({
    name: 'email',
    description: 'Email of the user',
    example: 'osama@example.com',
  })
  @ApiResponse({ status: 200, description: 'The user', type: Users })
  @ApiResponse({ status: 404, description: 'User not found' })
  public async findOneUserByEmail(@Param('email') email: string) {
    return this.usersService.getOneUserByEmail(email);
  }

  @Post()
  @UseGuards(AdminAccessOnlyGuard)
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: Users,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
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
  @ApiOperation({ summary: 'Update a user by ID (owner or admin)' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: Users,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiOperation({ summary: 'Delete a user by ID (owner or admin)' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  public async deleteUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.deleteUserById(id);
  }
}
