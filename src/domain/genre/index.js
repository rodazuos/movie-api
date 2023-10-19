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

const getGenre = async ({ genreRepository, id }) => {
  const genre = await genreRepository.getById(id, {
    includeDeleted: true
  });

  if (!genre) {
    throw NotFoundException('Gênero não encontrado!');
  }

  return returnData(genre);
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
  getGenre,
  updateGenre,
  deleteGenre
};
