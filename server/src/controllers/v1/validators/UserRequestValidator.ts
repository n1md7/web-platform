import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().min(5).max(32).required().label('Username'),
  password: Joi.string().min(8).max(128).required().label('Password'),
  confirmPassword: Joi.string().min(8).max(128).required().label('ConfirmPassword'),
  email: Joi.string().min(6).max(128).required().label('E-mail'),
});

export const authUserSchema = Joi.object({
  username: Joi.string().min(5).max(32).required().label('Username'),
  password: Joi.string().min(8).max(128).required().label('Password'),
  rememberMe: Joi.boolean().optional().default(false).label('Remember me'),
});
