const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Test extends Model {}
  Test.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'Test',
    timestamps: true
  });
  return Test;
};