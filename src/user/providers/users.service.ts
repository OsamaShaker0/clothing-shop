import { Injectable } from '@nestjs/common';
import { CreateUsersProvider } from './create-user.provider';
import { CreateUserDto } from '../dtos/create-user.dto';
import { GetAllUsersDto } from '../dtos/get-all-users.dto';
import { GetUsersProvider } from './get-users.provider';
import { GetOneUserProvider } from './get-one-user.provider';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UpdateUserProvider } from './update-user.provider';
import { DeleteUserProvider } from './delete-user.provider';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUsersProvider: CreateUsersProvider,
    private readonly getUsersProvider: GetUsersProvider,
    private readonly getOneUserProvider: GetOneUserProvider,
     private readonly updateUserProvider: UpdateUserProvider,
        private readonly deleteUserProvider: DeleteUserProvider,
  ) {}
  public getAllUsers(getAllUsersDto: GetAllUsersDto) {
    return this.getUsersProvider.getAllUsers(getAllUsersDto);
  }
  public getOneUserById(id: string) {
    return this.getOneUserProvider.getOneUserById(id);
  }
   public getOneUserByEmil(email: string) {
    return this.getOneUserProvider.getOneUserByEmail(email);
  }
  public async createUser(createUserDto: CreateUserDto) {
    return this.createUsersProvider.createUser(createUserDto);
  }
  public async updateUserById(id: string , updateUserDto : UpdateUserDto){
    return this.updateUserProvider.updateUserById(id,updateUserDto)
  }
  public async deleteUserById(id : string){
    return this.deleteUserProvider.deleteUserById(id)
  }
}
