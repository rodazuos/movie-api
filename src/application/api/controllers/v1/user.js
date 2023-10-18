const UserDomain = require("../../../../domain/user");
const jwt = require("../../../../utils/jwt");

const { createHash } = require("crypto");
const hash = createHash("sha256");

module.exports = ({ repository }) => {
  const { userRepository } = repository;

  const getUser = async (ctx) => {
    const { id } = ctx.request.params;
    const token = ctx.request.headers["authorization"];

    const tokenInfo = await jwt.verify(token);

    if (
      [
        UserDomain.typeAccount.ADMIN,
        UserDomain.typeAccount.ADMIN_USER,
      ].includes(tokenInfo.typeAccount)
    ) {
      const result = await UserDomain.getByUser({ userRepository, id });
      if (result) {
        ctx.status = 200;
        ctx.body = result;
      } else {
        ctx.status = 500;
      }
    } else {
      ctx.status = 401;
    }
  };

  const createUser = async (ctx) => {
    const { typeAccount, cpf, name, password } = ctx.request.body;
    const token = ctx.request.headers["authorization"];

    const tokenInfo = await jwt.verify(token);

    if (
      [
        UserDomain.typeAccount.ADMIN,
        UserDomain.typeAccount.ADMIN_USER,
      ].includes(tokenInfo.typeAccount)
    ) {
      const user = {
        typeAccount,
        cpf,
        name,
        password: hash.update(password).digest("hex"),
      };

      const resultCreate = await UserDomain.createUser({
        userRepository,
        user,
      });
      if (resultCreate) {
        ctx.status = 200;
        ctx.body = "Usuário criado com sucesso!";
      } else {
        ctx.status = 500;
      }
    } else {
      ctx.status = 401;
    }
  };

  const updateUser = async (ctx) => {
    const { typeAccount, cpf, name } = ctx.request.body;
    const token = ctx.request.headers["authorization"];

    const tokenInfo = await jwt.verify(token);

    if (
      [
        UserDomain.typeAccount.ADMIN,
        UserDomain.typeAccount.ADMIN_USER,
      ].includes(tokenInfo.typeAccount)
    ) {
      const user = {
        typeAccount,
        cpf,
        name,
      };

      const resultUpdate = await UserDomain.updateUser({
        userRepository,
        user,
      });
      if (resultUpdate) {
        ctx.status = 200;
        ctx.body = "Usuário atualizado com sucesso!";
      } else {
        ctx.status = 500;
      }
    } else {
      ctx.status = 401;
    }
  };

  const deleteUser = async (ctx) => {
    const { id } = ctx.request.params;

    const token = ctx.request.headers["authorization"];
    const tokenInfo = await jwt.verify(token);

    if (
      [
        UserDomain.typeAccount.ADMIN,
        UserDomain.typeAccount.ADMIN_USER,
      ].includes(tokenInfo.typeAccount)
    ) {
      const resultDelete = await UserDomain.deleteUser({ userRepository, id });
      if (resultDelete) {
        ctx.status = 200;
        ctx.body = "Usuário deletado com sucesso!";
      } else {
        ctx.status = 500;
      }
    } else {
      ctx.status = 401;
    }
  };

  return { getUser, createUser, updateUser, deleteUser };
};
