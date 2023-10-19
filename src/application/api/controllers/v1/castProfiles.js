const { OK } = require('http-status');
const CastProfileDomain = require('../../../../domain/castProfile');

module.exports = ({ repository }) => {
  const { castProfileRepository } = repository;

  const getCastProfile = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      const result = await CastProfileDomain.getCastProfile({ castProfileRepository, id });
      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      throw error;
    }
  };

  const createCastProfile = async (ctx) => {
    try {
      const { description } = ctx.request.body;

      const castProfile = {
        description
      };

      const result = await CastProfileDomain.createCastProfile({
        castProfileRepository,
        castProfile
      });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      throw error;
    }
  };

  const updateCastProfile = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      const { description } = ctx.request.body;

      const castProfile = {
        id,
        description
      };

      const result = await CastProfileDomain.updateCastProfile({
        castProfileRepository,
        castProfile
      });

      ctx.status = OK;
      ctx.body = result;
    } catch (error) {
      throw error;
    }
  };

  const deleteCastProfile = async (ctx) => {
    try {
      const { id } = ctx.request.params;
      await CastProfileDomain.deleteCastProfile({ castProfileRepository, id });
      ctx.status = OK;
    } catch (error) {
      throw error;
    }
  };

  return {
    getCastProfile,
    createCastProfile,
    updateCastProfile,
    deleteCastProfile
  };
};
