import * as Joi from 'joi';
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
  DATABASE_SYNCHRONIZE: Joi.boolean().required().default(false),
});
