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

const sanitizeUpdatePassword = async (data) => {
  const schema = Joi.object({
    password: Joi.string().required()
  });

  return validateSchema(schema, data);
};

module.exports = { sanitizeUpdatePassword };
