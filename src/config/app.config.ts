import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV,
  shippingPrice: Number(process.env.SHIPPING_PRICE) ?? 100,
  bestSellerNumber: Number(process.env.BEST_SELLER_NUMBER) ?? 10,
  newArrivalsDays: Number(process.env.NEW_ARRIVALS_DAYS) ?? 30,
  newArrivalsLimit: Number(process.env.NEW_ARRIVALS_LIMIT) ?? 20,
  emailHost: process.env.EMAIL_HOST,
  emailPort: Number(process.env.EMAIL_PORT),
  emailUser:process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
}));
