const User = require('./user');
const Movie = require('./movie');
const CastProfile = require('./castProfile');
const Genre = require('./genre');
const MovieCast = require('./moviesCast');
const MovieGenre = require('./moviesGenres');
const MovieVote = require('./moviesVote');

module.exports = ({ dbContext }) => ({
  userRepository: User(dbContext),
  movieRepository: Movie(dbContext),
  castProfileRepository: CastProfile(dbContext),
  genreRepository: Genre(dbContext),
  movieCastRepository: MovieCast(dbContext),
  movieGenreRepository: MovieGenre(dbContext),
  movieVoteRepository: MovieVote(dbContext)
});
