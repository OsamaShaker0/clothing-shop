import { registerAs } from '@nestjs/config';
export default registerAs('database', () => ({
  type: process.env.DATABSE_TYPE,
  port: +parseInt(process.env.DATABSE_PORT ?? '5432', 10),
  host: process.env.DATABSE_HOST,
  username: process.env.DATABSE_USERNAME,
  PASSWORD: process.env.DATABSE_PASSWORD,
  DATABSE: process.env.DATABSE_NAME,
  autoLoadEntities: process.env.DATABSE_AUTO_LOAD_ENTITIES ?? true,
  synchronize: process.env.DATABSE_SYNCHRONIZE ?? false,
}));
