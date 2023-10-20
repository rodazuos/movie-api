module.exports = (dbContext) => {
  const model = dbContext.models.movies_vote;
  const { Op } = dbContext.sequelize;
  const notDeletedClause = { deletedAt: null };

  const create = async ({ idMovie, idUser, vote }) => {
    const { dataValues } = await model.create({
      idMovie,
      idUser,
      vote
    });

    return dataValues;
  };

  const getAllByMovieId = async (idMovie, { includeDeleted = false } = {}) => {
    const whereConditions = includeDeleted ? { idMovie } : { [Op.and]: [{ idMovie }, notDeletedClause] };

    const queryResult = await model.findAll({ where: whereConditions, order: [['id', 'ASC']] });

    if (!queryResult) {
      return null;
    }

    const entities = queryResult.map((data) => {
      const { dataValues } = data;
      return dataValues;
    });

    return entities;
  };

  const update = async (movieVoteModel) => {
    movieVoteModel.updatedAt = dbContext.sequelize.literal("timezone('utc', now())");

    const whereConditions = {
      [Op.and]: [{ id: movieVoteModel.id }, notDeletedClause]
    };
    const entityToUpdated = await model.findOne({ where: whereConditions });
    if (!entityToUpdated) {
      return null;
    }

    const { dataValues } = await entityToUpdated.update(movieVoteModel);
    return dataValues;
  };

  const logicDeleteById = async (id) => {
    const entity = await model.findOne({
      where: { [Op.and]: [{ id }, notDeletedClause] }
    });

    if (!entity) {
      return null;
    }

    const { dataValues } = await entity.update({
      deletedAt: dbContext.sequelize.literal("timezone('utc', now())")
    });

    return dataValues;
  };

  return {
    create,
    getAllByMovieId,
    logicDeleteById,
    update
  };
};
