const { typeAccount } = require("../../../../domain/user");
const MovieDomain = require("../../../../domain/movie");
const jwt = require("../../../../utils/jwt");

module.exports = ({ repository }) => {
  const { movieRepository } = repository;

  const getMovie = async (ctx) => {
    const { id } = ctx.request.params;
    const token = ctx.request.headers["authorization"];
    const tokenInfo = await jwt.verify(token);
    if (tokenInfo) {
      const result = await MovieDomain.getMovie({ movieRepository, id });
      if (result) {
        ctx.status = 200;
        ctx.body = result;
      } else {
        ctx.status = 500;
      }
    } else {
      ctx.status = 401;
    }
  };

  const createMovie = async (ctx) => {
    const {
      title,
      originalTitle,
      releaseYear,
      ageGroup,
      duration,
      description,
      poster,
    } = ctx.request.body;
    const token = ctx.request.headers["authorization"];
    const tokenInfo = await jwt.verify(token);

    if (
      [typeAccount.ADMIN, typeAccount.ADMIN_USER].includes(
        tokenInfo.typeAccount
      )
    ) {
      const movie = {
        title,
        originalTitle,
        releaseYear,
        ageGroup,
        duration,
        description,
        poster,
      };

      const resultCreate = await MovieDomain.createMovie({
        movieRepository,
        movie,
      });
      if (resultCreate) {
        ctx.status = 200;
        ctx.body = "Filme criado com sucesso!";
      } else {
        ctx.status = 500;
      }
    } else {
      ctx.status = 401;
    }
  };

  const updateMovie = async (ctx) => {
    const {
      id,
      title,
      originalTitle,
      releaseYear,
      ageGroup,
      duration,
      description,
      poster,
    } = ctx.request.body;

    const token = ctx.request.headers["authorization"];
    const tokenInfo = await jwt.verify(token);

    if (
      [typeAccount.ADMIN, typeAccount.ADMIN_USER].includes(
        tokenInfo.typeAccount
      )
    ) {
      const movie = {
        id,
        title,
        originalTitle,
        releaseYear,
        ageGroup,
        duration,
        description,
        poster,
      };

      const resultUpdate = await MovieDomain.updateMovie({
        movieRepository,
        movie,
      });
      if (resultUpdate) {
        ctx.status = 200;
        ctx.body = "Filme atualizado com sucesso!";
      } else {
        ctx.status = 500;
      }
    } else {
      ctx.status = 401;
    }
  };

  const deleteMovie = async (ctx) => {
    const { id } = ctx.request.params;

    const token = ctx.request.headers["authorization"];
    const tokenInfo = await jwt.verify(token);

    if (
      [typeAccount.ADMIN, typeAccount.ADMIN_USER].includes(
        tokenInfo.typeAccount
      )
    ) {
      const resultDelete = await MovieDomain.deleteMovie({
        movieRepository,
        id,
      });
      if (resultDelete) {
        ctx.status = 200;
        ctx.body = "Filme deletado com sucesso!";
      } else {
        ctx.status = 500;
      }
    } else {
      ctx.status = 401;
    }
  };

  const voteMovie = async (ctx) => {
    ctx.status = 200;
  };

  const listMovies = async (ctx) => {
    ctx.status = 200;
  };

  return {
    getMovie,
    createMovie,
    updateMovie,
    deleteMovie,
    voteMovie,
    listMovies,
  };
};
