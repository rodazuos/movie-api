module.exports = (sequelize, DataTypes) => {
  const MoviesVote = sequelize.define(
    'movies_vote',
    {
      idMovie: {
        field: 'id_movie',
        type: DataTypes.BIGINT,
        references: {
          model: 'Movies',
          key: 'id'
        }
      },
      idUser: {
        field: 'id_user',
        type: DataTypes.BIGINT,
        references: {
          model: 'Users',
          key: 'id'
        }
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
