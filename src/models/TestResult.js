const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TestResult extends Model {}
  TestResult.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    score: { type: DataTypes.INTEGER, allowNull: false },
    totalQuestions: { type: DataTypes.INTEGER, allowNull: false },
    percentage: { type: DataTypes.FLOAT, allowNull: false }
  }, {
    sequelize,
    modelName: 'TestResult',
    timestamps: true
  });
  return TestResult;
};