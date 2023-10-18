const {
  NotFoundException,
  ConflictException,
} = require("../../infrastructure/errors");
const { createHash } = require("crypto");

const TYPE_ACCOUNT_ENUM = Object.freeze({
  ADMIN: 1,
  USER: 2,
  ADMIN_USER: 3,
});

const returnUserData = (user) => {
  return {
    id: user.id,
    typeAccount: user.typeAccount,
    cpf: user.cpf,
    name: user.name,
    isActive: user.deletedAt === null
  };
};

const createUser = async ({ userRepository, user }) => {
  const userExists = await userRepository.getByUser(user.cpf);
  if (userExists) {
    throw ConflictException("Usuário já cadastrado!");
  }

  const hash = createHash("sha256");
  user.password = hash.update("123456").digest("hex");

  const userCreated = await userRepository.create({ ...user });
  return returnUserData(userCreated);
};

const getUserById = async ({ userRepository, id, includeDeleted = true }) => {
  const user = await userRepository.getById(id, { includeDeleted });

  if (!user) {
    throw NotFoundException("Usuário não encontrado!");
  }

  return returnUserData(user);
};

const getUserByCPF = async ({ userRepository, cpf }) => {
  try {
    const user = await userRepository.getByUser(cpf);
    return user;
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async ({ userRepository, user }) => {
  const userUpdated = await userRepository.update(user);
  return returnUserData(userUpdated);
};

const deleteUser = async ({ userRepository, id }) => {
  const result = await userRepository.logicDeleteById(id);
  return result;
};

const updatePassword = async ({ userRepository, id, password }) => {
  const hash = createHash("sha256");
  const user = { id, password: hash.update(password).digest("hex") };
  const result = await userRepository.updatePassword(user);
  return result;
};

module.exports = {
  TYPE_ACCOUNT_ENUM,
  createUser,
  getUserById,
  getUserByCPF,
  updateUser,
  deleteUser,
  updatePassword,
};
