const Router = require("@koa/router");

module.exports = ({ authenticationController }) => {
  const router = new Router();

  router.get("/healthcheck", (ctx) => {
    ctx.body = "Application running. Healthcheck OK!";
  });

  router.post("/login", authenticationController.login);

  return router;
};
