const UserDomain = require("../../../../domain/user");

module.exports = ({ repository }) => {
  const { userRepository } = repository;

  const getUserProfile = async (ctx) => {
    const { id } = ctx.request.userState;
    const result = await UserDomain.getUserById({ userRepository, id });
    if (result) {
      ctx.status = 200;
      ctx.body = {
        id: result.id,
        typeAccount: result.typeAccount,
        cpf: result.cpf,
        name: result.name,
      };
      return;
    }

    return (ctx.status = 500);
  };

  const getUser = async (ctx) => {
    const { id } = ctx.request.params;
    const result = await UserDomain.getUserById({ userRepository, id });
    if (result) {
      ctx.status = 200;
      ctx.body = {
        id: result.id,
        typeAccount: result.typeAccount,
        cpf: result.cpf,
        name: result.name,
      };
      return;
    }

    return (ctx.status = 500);
  };

  const createUser = async (ctx) => {
    const { typeAccount, cpf, name } = ctx.request.body;
    const user = {
      typeAccount,
      cpf,
      name,
    };

    const result = await UserDomain.createUser({
      userRepository,
      user,
    });
    if (result) {
      ctx.status = 201;
      ctx.body = "Usuário criado com sucesso!";
      return;
    }

    return (ctx.status = 500);
  };

  const updateUser = async (ctx) => {
    const { typeAccount, cpf, name } = ctx.request.body;

    const user = {
      typeAccount,
      cpf,
      name,
    };

    const result = await UserDomain.updateUser({
      userRepository,
      user,
    });
    if (result) {
      ctx.status = 204;
      ctx.body = "Usuário atualizado com sucesso!";
      return;
    }

    return (ctx.status = 500);
  };

  const deleteUser = async (ctx) => {
    const { id } = ctx.request.params;

    const result = await UserDomain.deleteUser({ userRepository, id });
    if (result) {
      ctx.status = 204;
      ctx.body = "Usuário deletado com sucesso!";
      return;
    }

    return (ctx.status = 500);
  };

  const updatePassword = async (ctx) => {
    const { password } = ctx.request.body;
    const { id } = ctx.request.userState;

    const result = await UserDomain.updatePassword({
      userRepository,
      id,
      password,
    });
    if (result) {
      ctx.status = 204;
      ctx.body = "Senha alterada com sucesso!";
      return;
    }

    return (ctx.status = 500);
  };

  return {
    getUserProfile,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updatePassword,
  };
};
