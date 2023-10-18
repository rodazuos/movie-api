module.exports = (dbContext) => {
  const model = dbContext.models.users;
  const notDeletedClause = { deletedAt: null };

  const create = async ({ typeAccount, cpf, name, password }) => {
    const { dataValues } = await model.create({
      typeAccount,
      cpf,
      name,
      password,
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

  const update = async (userModel) => {
    const user = await getById(userModel.id, { includeDeleted: true });
    if (!user) {
      throw new Error("Usuário não encontrado!");
    }

    const { cpf, ...userValues } = userModel;
    await model.update(userValues, { where: { cpf } });
    return getByCpf(cpf);
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
