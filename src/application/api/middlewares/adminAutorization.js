const { UNAUTHORIZED } = require('http-status');
const { TYPE_ACCOUNT_ENUM } = require("../../../domain/user");

module.exports = () => {
  const adminAuthorization = async (ctx, next) => {
    const { typeAccount } = ctx.request.userState;
    if (
      [TYPE_ACCOUNT_ENUM.ADMIN, TYPE_ACCOUNT_ENUM.ADMIN_USER].includes(
        typeAccount
      )
    ) {
      return next();
    }
    ctx.status = UNAUTHORIZED;
  };

  return { adminAuthorization };
};
