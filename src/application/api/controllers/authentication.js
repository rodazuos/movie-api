module.exports = () => {
  const login = async (ctx) => {
    console.log(ctx.request.body);
    ctx.body = "login";
  };

  const isValidToken = async (ctx) => {
    console.log(ctx.request.body);
    ctx.body = "isValidToken";
  };

  return { login, isValidToken };
};
