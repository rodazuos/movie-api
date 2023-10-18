const { OK } = require('http-status');
const MovieDomain = require('../../../../domain/movie');

module.exports = ({ repository }) => {
  const { movieRepository } = repository;

  const getMovie = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      const result = await MovieDomain.getMovie({ movieRepository, id });
      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      throw error;
    }
  };

  const createMovie = async (ctx) => {
    try {
      const { title, originalTitle, releaseYear, ageGroup, duration, description, poster } = ctx.request.body;

      const movie = {
        title,
        originalTitle,
        releaseYear,
        ageGroup,
        duration,
        description,
        poster
      };

      const result = await MovieDomain.createMovie({
        movieRepository,
        movie
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
      const { title, originalTitle, releaseYear, ageGroup, duration, description, poster } = ctx.request.body;

      const movie = {
        id,
        title,
        originalTitle,
        releaseYear,
        ageGroup,
        duration,
        description,
        poster
      };

      const result = await MovieDomain.updateMovie({
        movieRepository,
        movie
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
