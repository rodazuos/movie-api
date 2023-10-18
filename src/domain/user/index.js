const { createHash } = require("crypto");
const hash = createHash("sha256");

const typeAccount = Object.freeze({
  ADMIN: 1,
  USER: 2,
  ADMIN_USER: 3,
});

const createUser = async ({ userRepository, user }) => {
  try {
    const creationResult = await userRepository.create({ ...user });
    return creationResult;
  } catch (error) {
    console.log(error);
  }
};

const getByUser = async ({ userRepository, id }) => {
  try {
    const user = await userRepository.getById(id, { includeDeleted: true });
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

module.exports = {
  typeAccount,
  createUser,
  getByUser,
  updateUser,
  deleteUser,
};
