const { OK } = require('http-status');
const GenreDomain = require('../../../../domain/genre');

module.exports = ({ repository }) => {
  const { genreRepository } = repository;

  const getAllGenre = async (ctx) => {
    try {
      const result = await GenreDomain.getAllGenre({ genreRepository });
      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      throw error;
    }
  };

  const createGenre = async (ctx) => {
    try {
      const { description } = ctx.request.body;

      const genre = {
        description
      };

      const result = await GenreDomain.createGenre({
        genreRepository,
        genre
      });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      throw error;
    }
  };

  const updateGenre = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      const { description } = ctx.request.body;

      const genre = {
        id,
        description
      };

      const result = await GenreDomain.updateGenre({
        genreRepository,
        genre
      });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      throw error;
    }
  };

  const deleteGenre = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      await GenreDomain.deleteGenre({ genreRepository, id });
      ctx.status = OK;
    } catch (error) {
      throw error;
    }
  };

  return {
    getAllGenre,
    createGenre,
    updateGenre,
    deleteGenre
  };
};
