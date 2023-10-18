const User = require("./user");
const Movie = require("./movie");

module.exports = ({ dbContext }) => ({
  userRepository: User(dbContext),
  movieRepository: Movie(dbContext),
});
