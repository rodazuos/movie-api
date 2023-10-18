const Router = require("@koa/router");

module.exports = ({
  authenticationController,
  userController,
  movieController,
}) => {
  const router = new Router();

  router.get("/healthcheck", (ctx) => {
    ctx.body = "Application running. Healthcheck OK!";
  });

  router.post("/login", authenticationController.login);
  router.post("/verifyToken", authenticationController.isValidToken);

  router.get("/v1/user/:id", userController.getUser);
  router.post("/v1/user", userController.createUser);
  router.put("/v1/user", userController.updateUser);
  router.delete("/v1/user/:id", userController.deleteUser);

  router.get("/v1/movie/:id", movieController.getMovie);
  router.post("/v1/movie", movieController.createMovie);
  router.put("/v1/movie", movieController.updateMovie);
  router.delete("/v1/movie/:id", movieController.deleteMovie);

  router.get("/v1/movie/list", movieController.listMovies);
  router.post("/v1/movie/vote", movieController.voteMovie);

  return router;
};
