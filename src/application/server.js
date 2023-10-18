require('dotenv').config();

const koa = require('koa');
const bodyParser = require('koa-bodyparser');

module.exports = ({ router }) => {
  const app = new koa();

  app.use(bodyParser({ enableTypes: ['json'] })).use(router.routes());

  return {
    app,
    start: async () => {
      try {
        app.listen(process.env.PORT, () => {
          console.log(`App running in port: ${process.env.PORT}`);
        });
      } catch (error) {
        console.log(`Problem to initializing application dependencies: ${error}`);
        process.exit(1);
      }
    }
  };
};
