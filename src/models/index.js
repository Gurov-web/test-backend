const sequelize = require('../config/db');

const defineUser = require('./User');
const defineTest = require('./Test');
const defineQuestion = require('./Question');
const defineTestResult = require('./TestResult');

const User = defineUser(sequelize);
const Test = defineTest(sequelize);
const Question = defineQuestion(sequelize);
const TestResult = defineTestResult(sequelize);

User.hasMany(Test, { foreignKey: 'createdBy', as: 'createdTests' });
Test.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Test.hasMany(Question, { foreignKey: 'testId', onDelete: 'CASCADE' });
Question.belongsTo(Test, { foreignKey: 'testId' });

User.hasMany(TestResult, { foreignKey: 'userId' });
TestResult.belongsTo(User, { foreignKey: 'userId' });

Test.hasMany(TestResult, { foreignKey: 'testId' });
TestResult.belongsTo(Test, { foreignKey: 'testId' });

module.exports = { sequelize, User, Test, Question, TestResult };