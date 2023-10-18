const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_DATABASE,
  DB_POOL_MAX,
  DB_POOL_MIN,
  DB_POOL_ACQUIRE,
  DB_POOL_IDLE,
} = process.env;

module.exports = () => {
  const connString = `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

  const sequelizeInstance = new Sequelize(connString, {
    dialect: "postgres",
    pool: {
      max: Number(DB_POOL_MAX),
      min: Number(DB_POOL_MIN),
      acquire: Number(DB_POOL_ACQUIRE),
      idle: Number(DB_POOL_IDLE),
    },
    logging: false,
  });

  const models = {};

  const dir = path.join(__dirname, "./models");

  fs.readdirSync(dir).forEach((file) => {
    const modelDir = path.join(dir, file);
    const model = require(modelDir)(sequelizeInstance, Sequelize.DataTypes);
    models[model.name] = model;
  });

  Object.keys(models).forEach((key) => {
    if ("associate" in models[key]) {
      models[key].associate(models);
    }
  });

  const rawSelectQuery = (queryString, replacements = {}) =>
    sequelizeInstance.query(queryString, {
      replacements,
      type: Sequelize.QueryTypes.SELECT,
    });

  return {
    models,
    sequelize: Sequelize,
    rawSelectQuery,
    sequelizeInstance,
  };
};
