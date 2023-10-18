const AuthorizationDomain = require("../../../domain/authorization");
const jwt = require("../../../utils/jwt");

module.exports = ({ repository }) => {
  const { userRepository } = repository;

  const login = async (ctx) => {
    const { cpf, password } = ctx.request.body;

    const result = await AuthorizationDomain.getAuthorization({
      userRepository,
      cpf,
      password,
    });
    if (result) {
      ctx.status = 200;
      ctx.body = result;
      return;
    }
    return (ctx.status = 401);
  };

  const isValidToken = async (ctx) => {
    const { token } = ctx.request.body;
    const result = await AuthorizationDomain.validateToken({
      userRepository,
      token,
    });
    if (result) {
      return (ctx.status = 200);
    }
    return (ctx.status = 401);
  };

  return { login, isValidToken };
};
