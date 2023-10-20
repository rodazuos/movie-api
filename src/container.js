const { asFunction, createContainer } = require('awilix');

const serverFactory = require('./application/server');
const routerFactory = require('./application/router');

const authenticationController = require('./application/api/controllers/authentication');
const userController = require('./application/api/controllers/v1/user');
const movieController = require('./application/api/controllers/v1/movies');

const castProfileController = require('./application/api/controllers/v1/castProfiles');
const genresController = require('./application/api/controllers/v1/genres');

const verifyAuthenticationMiddleware = require('./application/api/middlewares/verifyAuthentication');
const adminAuthorizationMiddleare = require('./application/api/middlewares/adminAutorization');
const userAuthorizationMiddleare = require('./application/api/middlewares/userAutorization');

const dbContextFactory = require('./infrastructure/database');
const repositories = require('./infrastructure/repositories');

const container = createContainer();

container.register({
  server: asFunction(serverFactory).singleton(),
  router: asFunction(routerFactory).singleton(),

  dbContext: asFunction(dbContextFactory).singleton(),
  repository: asFunction(repositories).singleton(),

  authenticationController: asFunction(authenticationController).singleton(),
  userController: asFunction(userController).singleton(),
  movieController: asFunction(movieController).singleton(),

  castProfileController: asFunction(castProfileController).singleton(),
  genresController: asFunction(genresController).singleton(),

  verifyAuthenticationMiddleware: asFunction(verifyAuthenticationMiddleware).singleton(),
  adminAuthorizationMiddleare: asFunction(adminAuthorizationMiddleare).singleton(),
  userAuthorizationMiddleare: asFunction(userAuthorizationMiddleare).singleton()
});

module.exports = container;
