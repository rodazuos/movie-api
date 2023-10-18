const crypto = require("crypto");

const { SWD_SECRET, SWD_IV } = process.env;

const algorithm = "aes-256-ctr";
const secretKey = SWD_SECRET;
const ivString = SWD_IV;

let iv;
if (ivString) {
  iv = Buffer.from(ivString, "hex");
}

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return encrypted.toString("hex");
};

const decrypt = (content) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString();
};

module.exports = {
  encrypt,
  decrypt,
};
