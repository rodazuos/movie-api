/* eslint-disable no-console */

const crypto = require('crypto');

const chave = "movie-service-api-key-crypto";
const chaveIV = "movie-service-api-iv";

const SWD_SECRET = crypto.scryptSync(chave, 'salt', 16).toString('hex');
const SWD_IV = crypto.scryptSync(chaveIV, 'salt', 16).toString('hex');

console.log(`SWD_SECRET=${SWD_SECRET}`);
console.log(`SWD_IV=${SWD_IV}`);