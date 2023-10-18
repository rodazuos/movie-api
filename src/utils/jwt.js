const jwt = require("jsonwebtoken");
const { encrypt, decrypt } = require("./swordfish");

const { JWT_KEY, EXPIRE_TOKEN } = process.env;

const sign = (user) => {
  const dataToEncrypt = {
    id: user.id,
    typeAccount: user.typeAccount,
  };
  const token = jwt.sign(
    { data: encrypt(JSON.stringify(dataToEncrypt)) },
    JWT_KEY,
    {
      expiresIn: EXPIRE_TOKEN,
    }
  );

  if (token) {
    return token.toString().trim();
  }
  return null;
};

const verify = async (token) => {
  try {
    if (token.includes("Bearer")) {
      token = token.split("Bearer")[1].trim();
    }

    const payload = jwt.verify(token, JWT_KEY);
    const dataDecrypted = JSON.parse(await decrypt(payload.data));

    return { ...dataDecrypted, iat: payload.iat, exp: payload.exp };
  } catch (error) {
    return console.log(error);
  }
};

module.exports = {
  sign,
  verify,
};
