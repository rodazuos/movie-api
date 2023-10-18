const UserDomain = require("../../../domain/user");
const jwt = require("../../../utils/jwt");

const { createHash } = require("crypto");
const hash = createHash("sha256");

module.exports = ({ repository }) => {
  const { userRepository } = repository;

  const login = async (ctx) => {
    const { cpf, password } = ctx.request.body;

    const user = await UserDomain.getByUser(userRepository, cpf);
    if (user) {
      if (hash.update(password).digest("hex") === user.password) {
        ctx.status = 200;
        ctx.body = await jwt.sign(user, "beludo");
      }
    } else {
      ctx.status = 401;
    }
  };

  const isValidToken = async (ctx) => {
    const { token } = ctx.request.body;
    ctx.body = await jwt.verify(token);
  };

  return { login, isValidToken };
};
