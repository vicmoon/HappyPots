const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Plant = require('./Plant');

const UserPlant = sequelize.define(
  'UserPlant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    plant_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Plant,
        key: 'id',
      },
    },
    nickname: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    acquired_date: {
      type: DataTypes.DATEONLY,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'user_plants',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Define associations
User.hasMany(UserPlant, { foreignKey: 'user_id' });
UserPlant.belongsTo(User, { foreignKey: 'user_id' });
Plant.hasMany(UserPlant, { foreignKey: 'plant_id' });
UserPlant.belongsTo(Plant, { foreignKey: 'plant_id' });

module.exports = UserPlant;
