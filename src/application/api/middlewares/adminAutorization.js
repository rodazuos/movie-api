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
    return (ctx.status = 401);
  };

  return { adminAuthorization };
};
