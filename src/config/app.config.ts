import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV,
  shippingPrice: Number(process.env.SHIPPING_PRICE) ?? 100,
}));
