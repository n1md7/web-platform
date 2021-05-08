import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().min(6).max(128).required().label('E-mail'),
  role: Joi.string().max(32).required().label('Role'),
  password: Joi.string().min(8).max(128).required().label('Password'),
  confirmPassword: Joi.string().min(8).max(128).required().label('ConfirmPassword'),
});

export const authUserSchema = Joi.object({
  email: Joi.string().min(6).max(128).required().label('E-mail'),
  password: Joi.string().min(8).max(128).required().label('Password'),
  rememberMe: Joi.boolean().optional().default(false).label('Remember me'),
});
