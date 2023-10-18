const jwt = require("../../utils/jwt");
const { createHash } = require("crypto");

const getAuthorization = async ({ userRepository, cpf, password }) => {
  const hash = createHash("sha256");
  try {
    const user = await userRepository.getByUser(cpf);
    if (hash.update(password).digest("hex") === user.password) {
      const token = await jwt.sign(user);
      const firstAccess = password === "123456";
      return { token, firstAccess };
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

const validateToken = async ({ userRepository, token }) => {
  try {
    const dataToken = await jwt.verify(token);
    if (dataToken) {
      const user = userRepository.getById(dataToken.id, {
        includeDeleted: false,
      });
      if (user) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAuthorization, validateToken };
