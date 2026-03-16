import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { OrderItem } from './order-item.entity';
import { OrderService } from './providers/order.service';
import { OrderCheckoutProvider } from './providers/order-checkout.provider';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './orders.controller';
import { OneItemCheckoutProvider } from './providers/one-item-checkout.provider';
import appConfig from 'src/config/app.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ConfigModule.forFeature(appConfig),
  ],
  providers: [OrderService, OrderCheckoutProvider, OneItemCheckoutProvider],
  controllers: [OrdersController],
})
export class OrderModule {}
