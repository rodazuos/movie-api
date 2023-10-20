const { NotFoundException, ConflictException } = require('../../infrastructure/errors');

const returnData = (castProfile) => {
  return {
    id: castProfile.id,
    description: castProfile.description,
    lastUpdated: castProfile.updateAt || castProfile.createdAt,
    isActive: castProfile.deletedAt === null
  };
};

const createCastProfile = async ({ castProfileRepository, castProfile }) => {
  const castProfileExists = await castProfileRepository.getByFilters({ description: castProfile.description });
  if (castProfileExists) {
    throw ConflictException('Perfil de elenco já cadastrado!');
  }

  const result = await castProfileRepository.create({ ...castProfile });
  return returnData(result);
};

const getCastProfile = async ({ castProfileRepository, id }) => {
  const castProfile = await castProfileRepository.getById(id, {
    includeDeleted: true
  });

  if (!castProfile) {
    throw NotFoundException('Perfil de elenco não encontrado!');
  }

  return returnData(castProfile);
};

const updateCastProfile = async ({ castProfileRepository, castProfile }) => {
  const result = await castProfileRepository.update(castProfile);

  if (!result) {
    throw NotFoundException('Perfil de elenco não encontrado!');
  }

  return returnData(result);
};

const deleteCastProfile = async ({ castProfileRepository, id }) => {
  const result = await castProfileRepository.logicDeleteById(id);

  if (!result) {
    throw NotFoundException('Perfil de elenco não encontrado!');
  }

  return returnData(result);
};

module.exports = {
  createCastProfile,
  getCastProfile,
  updateCastProfile,
  deleteCastProfile
};
