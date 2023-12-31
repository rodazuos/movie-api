const { OK } = require('http-status');
const MovieDomain = require('../../../../domain/movie');
const {
  sanitizeCreateMovie,
  sanitizeUpdateMovie,
  sanitizeMovieVote,
  sanitizeFiltersListMovie,
  sanitizeCreateCastMovie
} = require('../../forms/movie');
const Logger = require('../../../../utils/logger');

module.exports = ({ repository }) => {
  const { movieRepository, movieCastRepository, movieGenreRepository, movieVoteRepository } = repository;

  const getMovie = async (ctx) => {
    try {
      const { full } = ctx.request.query;
      const { id } = ctx.request.params;
      const { id: idUser } = ctx.request.userState;
      const result = await MovieDomain.getMovie({
        movieRepository,
        id,
        movieVoteRepository,
        full,
        movieGenreRepository,
        movieCastRepository,
        idUser
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
        movie
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
      const movie = {
        id,
        ...ctx.request.body
      };
      const dataValid = await sanitizeUpdateMovie(movie);

      const result = await MovieDomain.updateMovie({
        movieRepository,
        dataValid
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

  const addGenreMovie = async (ctx) => {
    try {
      const { idGenre, idMovie } = ctx.request.body;

      const modelGenreMovie = {
        idGenre,
        idMovie
      };

      const result = await MovieDomain.addGenreMovie({ modelGenreMovie, movieGenreRepository });
      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const deleteGenreMovie = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      await MovieDomain.deleteGenreMovie({ id, movieGenreRepository });
      ctx.status = OK;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const addCastMovie = async (ctx) => {
    try {
      const dataValid = await sanitizeCreateCastMovie(ctx.request.body);

      const modelCastMovie = {
        ...dataValid
      };

      const result = await MovieDomain.addCastMovie({ modelCastMovie, movieCastRepository });
      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const deleteCastMovie = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      await MovieDomain.deleteCastMovie({ id, movieCastRepository });
      ctx.status = OK;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const listGenresByMovie = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      const result = await MovieDomain.listGenresByMovie({ id, movieGenreRepository });
      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };

  const listCastByMovie = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      const result = await MovieDomain.listCastByMovie({ id, movieCastRepository });
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
    listMovies,
    addGenreMovie,
    deleteGenreMovie,
    addCastMovie,
    deleteCastMovie,
    listGenresByMovie,
    listCastByMovie
  };
};
