const { OK } = require('http-status');
const AuthorizationDomain = require('../../../domain/authorization');
const Logger = require('../../../utils/logger');

const { sanitizeLogin } = require('../forms/login');

module.exports = ({ repository }) => {
  const { userRepository } = repository;

  const login = async (ctx) => {
    try {
      const data = await sanitizeLogin(ctx.request.body);

      const result = await AuthorizationDomain.getAuthorization({
        userRepository,
        ...data
      });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const isValidToken = async (ctx) => {
    try {
      const { token } = ctx.request.body;

      await AuthorizationDomain.validateToken({
        userRepository,
        token
      });

      ctx.status = OK;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  return { login, isValidToken };
};
