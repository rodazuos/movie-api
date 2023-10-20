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
    poster: Joi.string().required(),
    cast: Joi.array()
      .items({
        idCastProfile: Joi.number().required(),
        name: Joi.string().required(),
        characterName: Joi.string(),
        photo: Joi.string()
      })
      .required(),
    genres: Joi.array()
      .items({
        idGenre: Joi.number().required()
      })
      .required()
  });

  return validateSchema(schema, data);
};

const sanitizeUpdateMovie = async (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    originalTitle: Joi.string(),
    releaseYear: Joi.string().required(),
    ageGroup: Joi.string().required(),
    duration: Joi.string().required(),
    description: Joi.string().required(),
    poster: Joi.string().required(),
    cast: Joi.array()
      .items({
        id: Joi.number().required(),
        idCastProfile: Joi.number().required(),
        name: Joi.string().required(),
        characterName: Joi.string(),
        photo: Joi.string(),
        delete: Joi.boolean()
      })
      .required(),
    cast_new: Joi.array().items({
      idCastProfile: Joi.number().required(),
      name: Joi.string().required(),
      characterName: Joi.string(),
      photo: Joi.string()
    }),
    genres: Joi.array()
      .items({
        id: Joi.number().required(),
        idGenre: Joi.number().required(),
        delete: Joi.boolean()
      })
      .required(),
    genres_new: Joi.array().items({
      idGenre: Joi.number().required()
    })
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

module.exports = { sanitizeCreateMovie, sanitizeUpdateMovie, sanitizeMovieVote, sanitizeFiltersListMovie };
