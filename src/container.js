const { asFunction, createContainer } = require("awilix");

const serverFactory = require("./application/server");
const routerFactory = require("./application/router");

const authenticationController = require("./application/api/controllers/authentication");
const userController = require("./application/api/controllers/v1/user");
const movieController = require("./application/api/controllers/v1/movies");

const dbContextFactory = require("./infrastructure/database");
const repositories = require("./infrastructure/repositories");

const container = createContainer();

container.register({
  server: asFunction(serverFactory).singleton(),
  router: asFunction(routerFactory).singleton(),

  dbContext: asFunction(dbContextFactory).singleton(),
  repository: asFunction(repositories).singleton(),

  authenticationController: asFunction(authenticationController).singleton(),
  userController: asFunction(userController).singleton(),
  movieController: asFunction(movieController).singleton(),
});

module.exports = container;
