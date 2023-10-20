const { OK } = require('http-status');
const MovieDomain = require('../../../../domain/movie');
const { sanitizeCreateMovie, sanitizeUpdateMovie } = require('../../forms/movie');

module.exports = ({ repository }) => {
  const { movieRepository, movieCastRepository, movieGenreRepository } = repository;

  const getMovie = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      const result = await MovieDomain.getMovie({ movieRepository, id, movieCastRepository, movieGenreRepository });
      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      throw error;
    }
  };

  const createMovie = async (ctx) => {
    try {
      const dataValid = await sanitizeCreateMovie(ctx.request.body);
      const movie = {
        ...dataValid
      };

      const result = await MovieDomain.createMovie({
        movieRepository,
        movie,
        movieCastRepository,
        movieGenreRepository
      });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      throw error;
    }
  };

  const updateMovie = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      const dataValid = await sanitizeUpdateMovie(ctx.request.body);
      const movie = {
        id,
        ...dataValid
      };

      const result = await MovieDomain.updateMovie({
        movieRepository,
        movie,
        movieCastRepository,
        movieGenreRepository
      });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      throw error;
    }
  };

  const deleteMovie = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      await MovieDomain.deleteMovie({ movieRepository, id });
      ctx.status = OK;
    } catch (error) {
      throw error;
    }
  };

  const voteMovie = async (ctx) => {
    try {
      ctx.status = OK;
    } catch (error) {
      throw error;
    }
  };

  const listMovies = async (ctx) => {
    try {
      ctx.status = OK;
    } catch (error) {
      throw error;
    }
  };

  return {
    getMovie,
    createMovie,
    updateMovie,
    deleteMovie,
    voteMovie,
    listMovies
  };
};
