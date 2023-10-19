const User = require('./user');
const Movie = require('./movie');
const CastProfile = require('./castProfile');
const Genre = require('./genre');

module.exports = ({ dbContext }) => ({
  userRepository: User(dbContext),
  movieRepository: Movie(dbContext),
  castProfileRepository: CastProfile(dbContext),
  genreRepository: Genre(dbContext)
});
