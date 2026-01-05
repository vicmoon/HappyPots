const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Plant = sequelize.define(
  'Plant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    perenual_id: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    common_name: {
      type: DataTypes.STRING,
    },
    scientific_name: {
      type: DataTypes.STRING,
    },
    other_names: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    family: {
      type: DataTypes.STRING(100),
    },
    origin: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING(50),
    },
    watering: {
      type: DataTypes.STRING(50),
    },
    sunlight: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    image_url: {
      type: DataTypes.TEXT,
    },
    cached_data: {
      type: DataTypes.JSONB,
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'plants',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = Plant;
