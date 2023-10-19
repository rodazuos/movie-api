module.exports = (dbContext) => {
  const model = dbContext.models.cast_profiles;
  const { Op } = dbContext.sequelize;
  const notDeletedClause = { deletedAt: null };

  const create = async (description) => {
    const { dataValues } = await model.create({...description});
    return dataValues;
  };

  const getByFilters = async (filters) => {
    const whereConditions = { [Op.or]: [{ ...filters }] };

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

  const update = async (castProfileModel) => {
    castProfileModel.updatedAt = dbContext.sequelize.literal("timezone('utc', now())");

    const whereConditions = {
      [Op.and]: [{ id: castProfileModel.id }, notDeletedClause]
    };
    const entityToUpdated = await model.findOne({ where: whereConditions });
    if (!entityToUpdated) {
      return null;
    }

    const { dataValues } = await entityToUpdated.update(castProfileModel);
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
