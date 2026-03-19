import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { OrderItem } from './order-item.entity';
import { OrderService } from './providers/order.service';
import { OrderCheckoutProvider } from './providers/order-checkout.provider';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './orders.controller';
import { OneItemCheckoutProvider } from './providers/one-item-checkout.provider';
import { ChangeOrderStatusProvider } from './providers/change-order-status.provider';
import { ChangeOrderPayStatusProvider } from './providers/change-order-pay-status.provider';
import { GetAllOrdersWithinDaysProvider } from './providers/get-all-orders-within-days.provider';
import { GetSellsNumberWithinDaysProvider } from './providers/get-sells-number-within-days.provider';
import appConfig from 'src/config/app.config';
import { Coupon } from 'src/coupons/coupon.entity';
import { CouponsModule } from 'src/coupons/coupons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Coupon]),
    ConfigModule.forFeature(appConfig),
    CouponsModule,
  ],
  providers: [
    OrderService,
    OrderCheckoutProvider,
    OneItemCheckoutProvider,
    ChangeOrderStatusProvider,
    ChangeOrderPayStatusProvider,
    GetAllOrdersWithinDaysProvider,
    GetSellsNumberWithinDaysProvider,
  ],
  controllers: [OrdersController],
  exports: [OrderService],
})
export class OrderModule {}
