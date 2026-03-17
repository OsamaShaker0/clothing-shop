import { Module } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
import { CategoryModule } from 'src/category/category.module';
import { OrderModule } from 'src/order/order.module';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { CategoryDashboardController } from './category-dashboard.controller';
import { ProductDashboardController } from './product-dashboard.controller';
import { ProductVariantDashboardController } from './product-variant-dashboard.controller';
import { CartDashboardController } from './cart-dashboard.controller';
import { OrderDashboardController } from './order-dashboard.controller';

import { UsersDashboardController } from './users-dashboard.controller';

@Module({
  imports: [UserModule, CategoryModule, ProductModule, CartModule, OrderModule],
  controllers: [
    CategoryDashboardController,
    ProductDashboardController,
    ProductVariantDashboardController,
    CartDashboardController,
    OrderDashboardController,
    UsersDashboardController,
  ],
})
export class DashboardModule {}
