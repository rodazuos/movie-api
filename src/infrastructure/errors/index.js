const { NOT_FOUND, INTERNAL_SERVER_ERROR, CONFLICT, UNAUTHORIZED, BAD_REQUEST } = require('http-status');

class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const UnauthorizedExcepation = (message) => new HttpError(message, UNAUTHORIZED);

const NotFoundException = (message) => new HttpError(message, NOT_FOUND);

const ConflictException = (message) => new HttpError(message, CONFLICT);

const InternalServerException = (message) => new HttpError(message, INTERNAL_SERVER_ERROR);

const BadRequestException = (message) => new HttpError(message, BAD_REQUEST);

module.exports = {
  UnauthorizedExcepation,
  NotFoundException,
  ConflictException,
  InternalServerException,
  BadRequestException
};
