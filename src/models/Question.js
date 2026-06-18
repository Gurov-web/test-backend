const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Question extends Model {}
    Question.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        testId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('multiple', 'code'),
            defaultValue: 'multiple'
        },
        questionText: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        codeSnippet: {
            type: DataTypes.TEXT,
            allowNull: true
        }, // ← Новый: код для задачи
        options: {
            type: DataTypes.JSON,
            allowNull: false
        },
        correctIndex: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Question',
        timestamps: true
    });
    return Question;
};