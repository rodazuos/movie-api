const { NotFoundException } = require("../../../infrastructure/errors");

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

  const getByUser = async (cpf) => {
    const { Op } = dbContext.sequelize;
    const whereConditions = { [Op.and]: [{ cpf }, notDeletedClause] };
    const queryResult = await model.findOne({ where: whereConditions });

    if (!queryResult) {
      return null;
    }

    const { dataValues } = queryResult;
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
    const { Op } = dbContext.sequelize;
    userModel.updatedAt = dbContext.sequelize.literal("timezone('utc', now())");

    const whereConditions = {
      [Op.and]: [{ id: userModel.id }, notDeletedClause],
    };
    const userToUpdated = await model.findOne({ where: whereConditions });
    if (!userToUpdated) {
      throw NotFoundException("Usuário não encontrado!");
    }

    const { dataValues } = await userToUpdated.update(userModel);
    return dataValues;
  };

  const updatePassword = async (userModel) => {
    const { Op } = dbContext.sequelize;
    userModel.updatedAt = dbContext.sequelize.literal("timezone('utc', now())");

    const whereConditions = {
      [Op.and]: [{ id: userModel.id }, notDeletedClause],
    };
    const userToUpdated = await model.findOne({ where: whereConditions });
    if (!userToUpdated) {
      throw NotFoundException("Usuário não encontrado!");
    }

    const user = await getById(userModel.id, { includeDeleted: false });
    if (!user) {
      throw NotFoundException("Usuário não encontrado!");
    }

    const { dataValues } = await userToUpdated.update(userModel);
    return dataValues;
  };

  const logicDeleteById = async (id) => {
    const { Op } = dbContext.sequelize;
    const entity = await model.findOne({
      where: { [Op.and]: [{ id }, notDeletedClause] },
    });

    if (!entity) {
      throw NotFoundException("Usuário não encontrado!");
    }

    const { dataValues } = await entity.update({
      deletedAt: dbContext.sequelize.literal("timezone('utc', now())"),
    });

    return dataValues;
  };

  return {
    create,
    getById,
    getByUser,
    logicDeleteById,
    update,
    updatePassword,
  };
};
