const { createHash } = require("crypto");
const hash = createHash("sha256");

const TYPE_ACCOUNT_ENUM = Object.freeze({
  ADMIN: 1,
  USER: 2,
  ADMIN_USER: 3,
});

const createUser = async ({ userRepository, user }) => {
  user.password = hash.update("123456").digest("hex");

  try {
    const creationResult = await userRepository.create({ ...user });
    return creationResult;
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async ({ userRepository, id, includeDeleted = true }) => {
  try {
    const user = await userRepository.getById(id, { includeDeleted });
    return user;
  } catch (error) {
    console.log(error);
  }
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
  try {
    const result = await userRepository.update(user);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async ({ userRepository, id }) => {
  try {
    const result = await userRepository.logicDeleteById(id);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const updatePassword = async ({ userRepository, id, password }) => {
  try {
    const user = { id, password: hash.update(password).digest("hex") };
    return userRepository.updatePassword(user);
  } catch (error) {
    console.log(error);
  }
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
