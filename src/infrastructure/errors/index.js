const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
} = require("http-status");

class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const UnauthorizedExcepation = (message) =>
  new HttpError(message, UNAUTHORIZED);

const NotFoundException = (message) => new HttpError(message, NOT_FOUND);

const ConflictException = (message) => new HttpError(message, CONFLICT);

const InternalServerException = (message) =>
  new HttpError(message, INTERNAL_SERVER_ERROR);

module.exports = {
  UnauthorizedExcepation,
  NotFoundException,
  ConflictException,
  InternalServerException,
};
