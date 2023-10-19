module.exports = (sequelize, DataTypes) => {
  const MoviesCast = sequelize.define(
    'movies_cast',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      id_movies: {
        field: 'id_movies',
        type: DataTypes.BIGINT,
        allowNull: false
      },
      id_cast_profiles: {
        field: 'id_cast_profiles',
        type: DataTypes.INTEGER,
        references: {
          model: 'CastProfiles',
          key: 'id'
      }
      },
      name: {
        field: 'name',
        type: DataTypes.STRING,
        allowNull: false
      },
      characterName: {
        field: 'character_name',
        type: DataTypes.STRING,
        allowNull: false
      },
      photo: {
        field: 'photo',
        type: DataTypes.STRING,
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

  MoviesCast.associate = models => {
    MoviesCast.belongsTo(models.cast_profiles, {
        foreignKey: 'id_cast_profiles',
        as: 'castProfiles'
    });
};

  return MoviesCast;
};
