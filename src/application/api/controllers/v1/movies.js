const { OK } = require('http-status');
const MovieDomain = require('../../../../domain/movie');
const {
  sanitizeCreateMovie,
  sanitizeUpdateMovie,
  sanitizeMovieVote,
  sanitizeFiltersListMovie
} = require('../../forms/movie');
const Logger = require('../../../../utils/logger');

module.exports = ({ repository }) => {
  const { movieRepository, movieCastRepository, movieGenreRepository, movieVoteRepository } = repository;

  const getMovie = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      const result = await MovieDomain.getMovie({
        movieRepository,
        id,
        movieCastRepository,
        movieGenreRepository,
        movieVoteRepository
      });
      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      Logger.error(error);
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
      Logger.error(error);
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
      Logger.error(error);
      throw error;
    }
  };

  const deleteMovie = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      await MovieDomain.deleteMovie({ movieRepository, id });
      ctx.status = OK;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const voteMovie = async (ctx) => {
    try {
      const { id: idMovie } = ctx.request.params;
      const { id: idUser } = ctx.request.userState;

      const voteData = await sanitizeMovieVote({
        idMovie,
        idUser,
        ...ctx.request.body
      });

      await MovieDomain.voteMovie({ movieVoteRepository, voteData });
      ctx.status = OK;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const listMovies = async (ctx) => {
    try {
      const filters = await sanitizeFiltersListMovie(ctx.request.query);

      const result = await MovieDomain.listMovies({
        movieRepository,
        movieCastRepository,
        movieGenreRepository,
        movieVoteRepository,
        filters
      });
      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      Logger.error(error);
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
