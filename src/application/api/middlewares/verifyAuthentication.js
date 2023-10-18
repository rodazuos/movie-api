const { UnauthorizedExcepation } = require('../../../infrastructure/errors');
const jwt = require('../../../utils/jwt');
const UserDomain = require('../../../domain/user');

module.exports = ({ repository }) => {
  const { userRepository } = repository;

  const verifyAuthentication = async (ctx, next) => {
    try {
      const token = ctx.request.headers['authorization'];
      const validToken = await jwt.verify(token);

      await UserDomain.getUserById({
        userRepository,
        id: validToken.id,
        includeDeleted: false
      });

      ctx.request.userState = {
        id: validToken.id,
        typeAccount: validToken.typeAccount
      };
      return next();
    } catch (error) {
      throw UnauthorizedExcepation('Usuário não autorizado!');
    }
  };

  return { verifyAuthentication };
};
