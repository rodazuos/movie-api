const Router = require('@koa/router');

module.exports = ({
  authenticationController,
  userController,
  movieController,
  castProfileController,
  genresController,
  verifyAuthenticationMiddleware,
  adminAuthorizationMiddleare,
  userAuthorizationMiddleare
}) => {
  const router = new Router();

  router.get('/healthcheck', (ctx) => {
    ctx.body = 'Application running. Healthcheck OK!';
  });

  router.post('/login', authenticationController.login);
  router.post('/verifyToken', authenticationController.isValidToken);

  router.get('/v1/user/myProfile', verifyAuthenticationMiddleware.verifyAuthentication, userController.getUserProfile);
  router.post(
    '/v1/user/updatePassword',
    verifyAuthenticationMiddleware.verifyAuthentication,
    userController.updatePassword
  );

  router.get(
    '/v1/user/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    userController.getUser
  );

  router.get(
    '/v1/users/list',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    userController.getUserList
  );

  router.post(
    '/v1/user',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    userController.createUser
  );
  router.put(
    '/v1/user/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    userController.updateUser
  );
  router.delete(
    '/v1/user/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    userController.deleteUser
  );

  router.get('/v1/movie/:id', verifyAuthenticationMiddleware.verifyAuthentication, movieController.getMovie);
  router.post(
    '/v1/movie',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    movieController.createMovie
  );
  router.put(
    '/v1/movie/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    movieController.updateMovie
  );
  router.delete(
    '/v1/movie/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    movieController.deleteMovie
  );

  router.post(
    '/v1/movie/genre',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    movieController.addGenreMovie
  );

  router.delete(
    '/v1/movie/genre/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    movieController.deleteGenreMovie
  );

  router.post(
    '/v1/movie/cast',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    movieController.addCastMovie
  );

  router.delete(
    '/v1/movie/cast/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    movieController.deleteCastMovie
  );

  router.get('/v1/movies/list', verifyAuthenticationMiddleware.verifyAuthentication, movieController.listMovies);
  router.get(
    '/v1/movie/genre/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    movieController.listGenresByMovie
  );
  router.get(
    '/v1/movie/cast/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    movieController.listCastByMovie
  );

  router.post(
    '/v1/movie/:id/vote',
    verifyAuthenticationMiddleware.verifyAuthentication,
    userAuthorizationMiddleare.userAuthorization,
    movieController.voteMovie
  );

  router.get(
    '/v1/cast-profile/list',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    castProfileController.getAllCastProfile
  );
  router.post(
    '/v1/cast-profile',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    castProfileController.createCastProfile
  );
  router.put(
    '/v1/cast-profile/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    castProfileController.updateCastProfile
  );
  router.delete(
    '/v1/cast-profile/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    castProfileController.deleteCastProfile
  );

  router.get(
    '/v1/genre/list',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    genresController.getAllGenre
  );
  router.post(
    '/v1/genre',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    genresController.createGenre
  );
  router.put(
    '/v1/genre/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    genresController.updateGenre
  );
  router.delete(
    '/v1/genre/:id',
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    genresController.deleteGenre
  );

  return router;
};
