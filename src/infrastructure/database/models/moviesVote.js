module.exports = (sequelize, DataTypes) => {
  const MoviesVote = sequelize.define(
    'movies_vote',
    {
      idMovies: {
        field: 'id_movies',
        type: DataTypes.BIGINT,
        allowNull: false
      },
      idUser: {
        field: 'id_user',
        type: DataTypes.BIGINT,
        allowNull: false
      },
      vote: {
        field: 'vote',
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("timezone('utc', now())")
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        allowNull: true
      },
      deletedAt: {
        field: 'deleted_at',
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      freezeTableName: true,
      timestamps: false
    }
  );

  return MoviesVote;
};
