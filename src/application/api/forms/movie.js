const Joi = require('joi');
const { BadRequestException } = require('../../../infrastructure/errors');

const validateSchema = async (schema, data) => {
  try {
    const validFields = await schema.validateAsync(data);
    return validFields;
  } catch (error) {
    const errors = error.details.map((error) => error.message);
    throw BadRequestException(errors.join());
  }
};

const sanitizeCreateMovie = async (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    originalTitle: Joi.string(),
    releaseYear: Joi.string().required(),
    ageGroup: Joi.string().required(),
    duration: Joi.string().required(),
    description: Joi.string().required(),
    poster: Joi.string().required()
  });

  return validateSchema(schema, data);
};


const sanitizeCreateCastMovie = async (data) => {
  const schema = Joi.object({
    idMovie: Joi.number().required(),
    idCastProfile: Joi.number().required(),
    name: Joi.string().required(),
    characterName: Joi.string(),
    photo: Joi.string()
  });

  return validateSchema(schema, data);
};

const sanitizeUpdateMovie = async (data) => {
  const schema = Joi.object({
    id: Joi.number(),
    title: Joi.string().required(),
    originalTitle: Joi.string(),
    releaseYear: Joi.string().required(),
    ageGroup: Joi.string().required(),
    duration: Joi.string().required(),
    description: Joi.string().required(),
    poster: Joi.string().required(),
    active: Joi.boolean().required()
  });

  return validateSchema(schema, data);
};

const sanitizeMovieVote = async (data) => {
  const schema = Joi.object({
    id: Joi.number(),
    idUser: Joi.number().required(),
    idMovie: Joi.number().required(),
    vote: Joi.number().min(0).max(4).required(),
    delete: Joi.boolean()
  });

  return validateSchema(schema, data);
};

const sanitizeFiltersListMovie = async (data) => {
  const schema = Joi.object({
    title: Joi.string(),
    director: Joi.string(),
    genre: Joi.string(),
    actor: Joi.string(),
    limit: Joi.number().min(1).max(10),
    page: Joi.number()
  });

  return validateSchema(schema, data);
};

module.exports = { sanitizeCreateMovie, sanitizeUpdateMovie, sanitizeMovieVote, sanitizeFiltersListMovie, sanitizeCreateCastMovie };
