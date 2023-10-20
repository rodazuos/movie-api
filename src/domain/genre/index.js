const { NotFoundException, ConflictException } = require('../../infrastructure/errors');

const returnData = (genre) => {
  return {
    id: genre.id,
    description: genre.description,
    lastUpdated: genre.updateAt || genre.createdAt,
    isActive: genre.deletedAt === null
  };
};

const createGenre = async ({ genreRepository, genre }) => {
  const genreExists = await genreRepository.getByFilters({ description: genre.description });
  if (genreExists) {
    throw ConflictException('Gênero já cadastrado!');
  }

  const result = await genreRepository.create({ ...genre });
  return returnData(result);
};

const getAllGenre = async ({ genreRepository }) => {
  const listGenre = await genreRepository.getAll();

  if (!listGenre) {
    throw NotFoundException('Nenhum gênero encontrado!');
  }

  const listNormalized = listGenre.map((genre) => returnData(genre));

  return listNormalized;
};

const updateGenre = async ({ genreRepository, genre }) => {
  const result = await genreRepository.update(genre);

  if (!result) {
    throw NotFoundException('Gênero não encontrado!');
  }

  return returnData(result);
};

const deleteGenre = async ({ genreRepository, id }) => {
  const result = await genreRepository.logicDeleteById(id);

  if (!result) {
    throw NotFoundException('Gênero não encontrado!');
  }

  return returnData(result);
};

module.exports = {
  createGenre,
  getAllGenre,
  updateGenre,
  deleteGenre
};
