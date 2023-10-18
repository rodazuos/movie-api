const Router = require("@koa/router");

module.exports = ({
  authenticationController,
  userController,
  movieController,
  verifyAuthenticationMiddleware,
  adminAuthorizationMiddleare,
}) => {
  const router = new Router();

  router.get("/healthcheck", (ctx) => {
    ctx.body = "Application running. Healthcheck OK!";
  });

  router.post("/login", authenticationController.login);
  router.post("/verifyToken", authenticationController.isValidToken);

  router.get(
    "/v1/user/myProfile",
    verifyAuthenticationMiddleware.verifyAuthentication,
    userController.getUserProfile
  );
  router.post(
    "/v1/user/updatePassword",
    verifyAuthenticationMiddleware.verifyAuthentication,
    userController.updatePassword
  );

  router.get(
    "/v1/user/:id",
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    userController.getUser
  );
  router.post(
    "/v1/user",
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    userController.createUser
  );
  router.put(
    "/v1/user",
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    userController.updateUser
  );
  router.delete(
    "/v1/user/:id",
    verifyAuthenticationMiddleware.verifyAuthentication,
    adminAuthorizationMiddleare.adminAuthorization,
    userController.deleteUser
  );

  router.get(
    "/v1/movie/:id",
    verifyAuthenticationMiddleware.verifyAuthentication,
    movieController.getMovie
  );
  router.post(
    "/v1/movie",
    verifyAuthenticationMiddleware.verifyAuthentication,
    movieController.createMovie
  );
  router.put(
    "/v1/movie",
    verifyAuthenticationMiddleware.verifyAuthentication,
    movieController.updateMovie
  );
  router.delete(
    "/v1/movie/:id",
    verifyAuthenticationMiddleware.verifyAuthentication,
    movieController.deleteMovie
  );

  router.get(
    "/v1/movie/list",
    verifyAuthenticationMiddleware.verifyAuthentication,
    movieController.listMovies
  );
  router.post(
    "/v1/movie/vote",
    verifyAuthenticationMiddleware.verifyAuthentication,
    movieController.voteMovie
  );

  return router;
};
