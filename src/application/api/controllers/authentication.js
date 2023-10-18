const { OK } = require("http-status");
const AuthorizationDomain = require("../../../domain/authorization");

module.exports = ({ repository }) => {
  const { userRepository } = repository;

  const login = async (ctx) => {
    try {
      const { cpf, password } = ctx.request.body;

      const result = await AuthorizationDomain.getAuthorization({
        userRepository,
        cpf,
        password,
      });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      throw error;
    }
  };

  const isValidToken = async (ctx) => {
    try {
      const { token } = ctx.request.body;

      await AuthorizationDomain.validateToken({
        userRepository,
        token,
      });

      ctx.status = OK;
    } catch (error) {
      throw error;
    }
  };

  return { login, isValidToken };
};
