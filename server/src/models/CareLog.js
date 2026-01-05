const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserPlant = require('./UserPlant');

const CareLog = sequelize.define(
  'CareLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_plant_id: {
      type: DataTypes.INTEGER,
      references: {
        model: UserPlant,
        key: 'id',
      },
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['watered', 'fertilized', 'pruned', 'repotted', 'other']],
      },
    },
    notes: {
      type: DataTypes.TEXT,
    },
    log_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'care_logs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

UserPlant.hasMany(CareLog, { foreignKey: 'user_plant_id' });
CareLog.belongsTo(UserPlant, { foreignKey: 'user_plant_id' });

module.exports = CareLog;
