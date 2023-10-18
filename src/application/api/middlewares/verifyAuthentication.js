const jwt = require("../../../utils/jwt");
const UserDomain = require("../../../domain/user");

module.exports = ({ repository }) => {
  const { userRepository } = repository;

  const verifyAuthentication = async (ctx, next) => {
    const token = ctx.request.headers["authorization"];
    const validToken = await jwt.verify(token);
    if (validToken) {
      const user = await UserDomain.getUserById({
        userRepository,
        id: validToken.id,
        includeDeleted: false,
      });
      if (user) {
        ctx.request.userState = {
          id: validToken.id,
          typeAccount: validToken.typeAccount,
        };
        return next();
      }
    }
    return (ctx.status = 401);
  };

  return { verifyAuthentication };
};
