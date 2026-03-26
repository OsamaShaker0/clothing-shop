import * as Joi from 'joi';
import { join } from 'path';
export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production', 'statging')
    .default('development'),
  DATABASE_TYPE: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432).required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_AUTO_LOAD_ENTITIES: Joi.boolean().required().default(true),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  CLOUDINARY_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().default(86400),
  SHIPPING_PRICE: Joi.number().default(100),
});
