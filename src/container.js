const { asFunction, createContainer } = require("awilix");

const serverFactory = require("./application/server");
const routerFactory = require("./application/router");

const authenticationController = require("./application/api/controllers/authentication");

const container = createContainer();

container.register({
  server: asFunction(serverFactory).singleton(),
  router: asFunction(routerFactory).singleton(),

  authenticationController: asFunction(authenticationController).singleton(),
});

module.exports = container;
