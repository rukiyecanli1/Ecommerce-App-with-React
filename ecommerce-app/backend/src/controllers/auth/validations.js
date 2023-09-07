import Joi from 'joi';

const Schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

export default Schema;
