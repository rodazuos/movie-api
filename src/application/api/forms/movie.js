const Joi = require('joi');
const { BadRequestException } = require('../../../infrastructure/errors');

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

  try {
    const validFields = await schema.validateAsync(data);
    return validFields;
  } catch (error) {
    const errors = error.details.map((error) => error.message);
    throw BadRequestException(errors.join());
  }
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

  try {
    const validFields = await schema.validateAsync(data);
    return validFields;
  } catch (error) {
    const errors = error.details.map((error) => error.message);
    throw BadRequestException(errors.join());
  }
};

module.exports = { sanitizeCreateMovie, sanitizeUpdateMovie };
