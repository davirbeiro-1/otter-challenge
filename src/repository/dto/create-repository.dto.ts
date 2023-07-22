import * as Joi from 'joi';

export const createRepositorySchema = Joi.object({
  id: Joi.number().required(),
  createdAt: Joi.date(),
  name: Joi.string().required(),
  description: Joi.string(),
  url: Joi.string().required(),
  language: Joi.string(),
  owner: Joi.object({
    id: Joi.number().required(),
  }),
});

export class CreateRepositoryDTO {
  id: number;
  createdAt?: Date;
  name: string;
  description?: string;
  url: string;
  language?: string;
  owner: {
    id: number;
  };
}
