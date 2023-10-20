module.exports = (dbContext) => {
  const model = dbContext.models.movies;
  const { Op } = dbContext.sequelize;
  const notDeletedClause = { deletedAt: null };

  const create = async ({ title, originalTitle, releaseYear, ageGroup, duration, description, poster }) => {
    const { dataValues } = await model.create({
      title,
      originalTitle,
      releaseYear,
      ageGroup,
      duration,
      description,
      poster
    });

    return dataValues;
  };

  const getByFilters = async (filters) => {
    const preparedFilters = Object.entries(filters).map((filter) => {
      const newObjectFilter = { [filter[0]]: { [Op.eq]: filter[1] } };
      return newObjectFilter;
    });
    const whereConditions = { [Op.or]: preparedFilters };
    const queryResult = await model.findOne({ where: whereConditions });
    if (!queryResult) {
      return null;
    }

    const { dataValues } = queryResult;
    return dataValues;
  };

  const getById = async (id, { includeDeleted = false } = {}) => {
    const whereConditions = includeDeleted ? { id } : { [Op.and]: [{ id }, notDeletedClause] };

    const queryResult = await model.findOne({ where: whereConditions });

    if (!queryResult) {
      return null;
    }

    const { dataValues } = queryResult;
    return dataValues;
  };

  const update = async (movieModel) => {
    movieModel.updatedAt = dbContext.sequelize.literal("timezone('utc', now())");

    const whereConditions = {
      [Op.and]: [{ id: movieModel.id }, notDeletedClause]
    };
    const entityToUpdated = await model.findOne({ where: whereConditions });
    if (!entityToUpdated) {
      return null;
    }

    const { dataValues } = await entityToUpdated.update(movieModel);
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
    getById,
    logicDeleteById,
    update,
    getByFilters
  };
};
