module.exports = (sequelize, DataTypes) => {
  const CastProfiles = sequelize.define(
    "cast_profiles",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      id_movies: {
        field: "id_movies",
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      id_cast_profiles: {
        field: "id_cast_profiles",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        field: "name",
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("timezone('utc', now())"),
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return CastProfiles;
};
