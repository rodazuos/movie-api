const Joi = require('joi');
const { BadRequestException } = require('../../../infrastructure/errors');

const sanitizeMovie = async data => {
    const schema = Joi.object({
        title: Joi.string().required(),
        originalTitle: Joi.string(),
        releaseYear: Joi.string().required(),
        ageGroup: Joi.string().required(),
        duration: Joi.string().required(),
        description: Joi.string().required(),
        poster: Joi.string().required()
    });

    try {
        const validFields = await schema.validateAsync(data);
        return validFields;
    } catch (error) {
        const errors = error.details.map(error => (error.message));
        throw BadRequestException(errors.join());
    }
};

module.exports = { sanitizeMovie };