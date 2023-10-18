module.exports = (dbContext) => {
  const model = dbContext.models.movies;
  const notDeletedClause = { deletedAt: null };

  const create = async ({
    title,
    originalTitle,
    releaseYear,
    ageGroup,
    duration,
    description,
    poster,
  }) => {
    const { dataValues } = await model.create({
      title,
      originalTitle,
      releaseYear,
      ageGroup,
      duration,
      description,
      poster,
    });

    return dataValues;
  };

  const getById = async (id, { includeDeleted = false } = {}) => {
    const { Op } = dbContext.sequelize;
    const whereConditions = includeDeleted
      ? { id }
      : { [Op.and]: [{ id }, notDeletedClause] };

    const queryResult = await model.findOne({ where: whereConditions });

    if (!queryResult) {
      return null;
    }

    const { dataValues } = queryResult;
    return dataValues;
  };

  const update = async (movieModel) => {
    const movie = await getById(movieModel.id, { includeDeleted: true });
    if (!movie) {
      throw new Error("Filme não encontrado!");
    }

    const { ...movieValues } = movieModel;
    await model.update(movieValues, { where: { id: movieModel.id } });
    return getById(movieModel.id);
  };

  const logicDeleteById = async (id) => {
    const { Op } = dbContext.sequelize;
    const entity = await model.findOne({
      where: { [Op.and]: [{ id }, notDeletedClause] },
    });

    if (!entity) {
      return null;
    }

    const { dataValues } = await entity.update({
      deletedAt: dbContext.sequelize.literal("timezone('utc', now())"),
    });

    return dataValues;
  };

  return {
    create,
    getById,
    logicDeleteById,
    update,
  };
};
