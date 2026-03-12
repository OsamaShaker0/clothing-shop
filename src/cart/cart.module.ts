import { Module } from '@nestjs/common';
import { CreateCartProvider } from './providers/create-cart.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';

import { UserModule } from 'src/user/user.module';
import { AddItemToCartProvider } from './providers/add-item-to-cart.provider';
import { CartService } from './providers/cart.service';
import { CartController } from './cart.controller';
import { ProductModule } from 'src/product/product.module';
import { AuthModule } from 'src/auth/auth.module';
import { GetAllCartItemsProvider } from './providers/get-all-cart-items.provider';
import { DeleteCartItemProvider } from './providers/delete-cart-item.provider';
import { DeleteAllItemsProvider } from './providers/delete-all-items.provider';
import { DeleteUserCartProvider } from './providers/delete-user-cart.provider';
import { FindCartProvider } from './providers/find-cart.provider';
import { GetAllCartsForAdminProvider } from './providers/get-all-carts-for-admin.provider';
import { FindCurrentUserCartProvider } from './providers/find-current-user-cart.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    UserModule,
    ProductModule,
    AuthModule,
  ],
  providers: [
    CreateCartProvider,
    AddItemToCartProvider,
    CartService,
    GetAllCartItemsProvider,
    DeleteCartItemProvider,
    DeleteAllItemsProvider,
    DeleteUserCartProvider,
    FindCartProvider,
    GetAllCartsForAdminProvider,
    FindCurrentUserCartProvider,
  ],
  controllers: [CartController],
})
export class CartModule {}
