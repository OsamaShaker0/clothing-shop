import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import databaseConfig from './config/database.config';
import environmentValidations from './config/environment.validations';
import cloudinaryConfig from './config/cloudinary.config';
import jwtConfig from './config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';

let ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [databaseConfig, cloudinaryConfig, jwtConfig],
      validationSchema: environmentValidations,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('DATABASE_TYPE'),
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(
          configService.get<string>('DATABASE_PORT') || '5432',
          10,
        ),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities:
          configService.get<boolean>('DATABASE_AUTO_LOAD_ENTITIES') === true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    CartModule,
    OrderModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
