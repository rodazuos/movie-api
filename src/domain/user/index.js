const { NotFoundException, ConflictException } = require('../../infrastructure/errors');
const { createHash } = require('crypto');

const TYPE_ACCOUNT_ENUM = Object.freeze({
  ADMIN: 1,
  USER: 2,
  ADMIN_USER: 3
});

const returnUserData = (user) => {
  const typeAccount = user.typeAccount || user.type_account;
  const deletedDate = user.deletedAt || user.deleted_at;

  return {
    id: user.id,
    typeAccount: typeAccount,
    typeAccountDescription: typeAccount === TYPE_ACCOUNT_ENUM.ADMIN ? 'Administrador' : 'Usuário',
    cpf: user.cpf,
    name: user.name,
    isActive: deletedDate === null || deletedDate === undefined
  };
};

const createUser = async ({ userRepository, user }) => {
  const userExists = await userRepository.getByUser(user.cpf);
  if (userExists) {
    throw ConflictException('Usuário já cadastrado!');
  }

  const hash = createHash('sha256');
  user.password = hash.update('123456').digest('hex');

  const userCreated = await userRepository.create({ ...user });
  return returnUserData(userCreated);
};

const getUserById = async ({ userRepository, id, includeDeleted = true }) => {
  const user = await userRepository.getById(id, { includeDeleted });

  if (!user) {
    throw NotFoundException('Usuário não encontrado!');
  }

  return returnUserData(user);
};

const getUserList = async ({ userRepository, filters, includeDeleted = true }) => {
  const userList = await userRepository.getListUsers(filters, { includeDeleted });

  if (userList.total > 0) {
    const normalizedResult = userList.queryResult.map((user) => {
      return returnUserData(user);
    });

    return { data: normalizedResult, total: userList.total, page: userList.page };
  }

  return { data: 0, total: 0, page: 0 };
};

const updateUser = async ({ userRepository, user }) => {
  const userUpdated = await userRepository.update(user);

  if (!userUpdated) {
    throw NotFoundException('Usuário não encontrado!');
  }

  return returnUserData(userUpdated);
};

const deleteUser = async ({ userRepository, id }) => {
  const result = await userRepository.logicDeleteById(id);

  if (!result) {
    throw NotFoundException('Usuário não encontrado!');
  }

  return result;
};

const updatePassword = async ({ userRepository, id, password }) => {
  const hash = createHash('sha256');
  const user = { id, password: hash.update(password).digest('hex') };
  const result = await userRepository.updatePassword(user);

  if (!result) {
    throw NotFoundException('Usuário não encontrado!');
  }

  return result;
};

module.exports = {
  TYPE_ACCOUNT_ENUM,
  createUser,
  getUserById,
  getUserList,
  updateUser,
  deleteUser,
  updatePassword
};
