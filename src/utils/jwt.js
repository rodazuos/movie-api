const jwt = require("jsonwebtoken");
const { encrypt, decrypt } = require("./swordfish");

const { JWT_KEY, EXPIRE_TOKEN } = process.env;

const sign = (payload, data2encrypt) => {
  if (typeof data2encrypt !== "string") {
    data2encrypt = JSON.stringify(data2encrypt);
  }

  payload.swordfish = encrypt(data2encrypt);

  const token = jwt.sign(payload, JWT_KEY, {
    expiresIn: EXPIRE_TOKEN,
  });

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
    payload.swordfish = await decrypt(payload.swordfish);
    return payload;
  } catch (error) {
    return console.log(error);
  }
};

module.exports = {
  sign,
  verify,
};
