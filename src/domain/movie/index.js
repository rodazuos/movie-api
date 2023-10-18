const createMovie = async ({ movieRepository, movie }) => {
  try {
    const creationResult = await movieRepository.create({ ...movie });
    return creationResult;
  } catch (error) {
    console.log(error);
  }
};

const getMovie = async ({ movieRepository, id }) => {
  console.log(id);
  try {
    const movie = await movieRepository.getById(id, {
      includeDeleted: true,
    });
    return movie;
  } catch (error) {
    console.log(error);
  }
};

const updateMovie = async ({ movieRepository, movie }) => {
  try {
    const result = await movieRepository.update(movie);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const deleteMovie = async ({ movieRepository, id }) => {
  try {
    const result = await movieRepository.logicDeleteById(id);
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createMovie,
  getMovie,
  updateMovie,
  deleteMovie,
};
