module.exports = (sequelize, DataTypes) => {
  const CastProfiles = sequelize.define(
    'cast_profiles',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      description: {
        field: 'description',
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "AUDIO"
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

  return CastProfiles;
};
