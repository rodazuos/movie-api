module.exports = (dbContext) => {
  const model = dbContext.models.cast_profiles;
  const { Op } = dbContext.sequelize;
  const notDeletedClause = { deletedAt: null };

  const create = async (description) => {
    const { dataValues } = await model.create({ ...description });
    return dataValues;
  };

  const getAll = async () => {
    const queryResult = await model.findAll({ order: [['description', 'ASC']] });

    if (!queryResult) {
      return null;
    }

    const entities = queryResult.map((data) => {
      const { dataValues } = data;
      return dataValues;
    });

    return entities;
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
    getAll,
    logicDeleteById,
    update
  };
};
