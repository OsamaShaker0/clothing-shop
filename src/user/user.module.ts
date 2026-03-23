import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUsersProvider } from './providers/create-user.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { UserController } from './user.controller';
import { GetUsersProvider } from './providers/get-users.provider';
import { GetOneUserProvider } from './providers/get-one-user.provider';
import { UpdateUserProvider } from './providers/update-user.provider';
import { DeleteUserProvider } from './providers/delete-user.provider';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [
    UsersService,
    CreateUsersProvider,
    GetUsersProvider,
    GetOneUserProvider,
    UpdateUserProvider,
    DeleteUserProvider,
  ],
  imports: [TypeOrmModule.forFeature([Users]), forwardRef(() => AuthModule) ],
  controllers: [UserController],
  exports: [UsersService],
})
export class UserModule {}
