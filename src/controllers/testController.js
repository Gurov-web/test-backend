const { Test, Question, TestResult } = require('../models');

const getAllTests = async (req, res) => {
  try {
    const tests = await Test.findAll({
      attributes: ['id', 'title', 'description', 'category'],
      include: [{ model: Question, attributes: ['id'] }]
    });

    const result = tests.map(t => ({
      ...t.toJSON(),
      questionCount: t.Questions ? t.Questions.length : 0
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};

const getTestById = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id, {
      include: [{ model: Question }]
    });
    if (!test) return res.status(404).json({ msg: 'Тест не найден' });
    res.json(test);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};

const submitTest = async (req, res) => {
    try {
        const { answers } = req.body;
        const testId = req.params.id;
        const userId = req.user.id;

        // === ПРОВЕРКА: уже проходил ли пользователь этот тест ===
        const existingResult = await TestResult.findOne({
            where: { userId, testId }
        });

        if (existingResult) {
            return res.status(400).json({
                msg: 'Вы уже проходили этот тест. Повторное прохождение запрещено.'
            });
        }

        const test = await Test.findByPk(testId, {
            include: [{ model: Question }]
        });

        if (!test) return res.status(404).json({ msg: 'Тест не найден' });
        if (!answers || answers.length !== test.Questions.length) {
            return res.status(400).json({ msg: 'Неверное количество ответов' });
        }

        let score = 0;
        test.Questions.forEach((q, i) => {
            if (answers[i] === q.correctIndex) score++;
        });

        const total = test.Questions.length;
        const percentage = Math.round((score / total) * 100);

        const result = await TestResult.create({
            userId,
            testId: test.id,
            score,
            totalQuestions: total,
            percentage
        });

        res.json({ score, total, percentage, resultId: result.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
};

const getUserResults = async (req, res) => {
  try {
    const results = await TestResult.findAll({
      where: { userId: req.user.id },
      include: [{ 
        model: Test, 
        attributes: ['id', 'title', 'category'] 
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(results);
  } catch (err) {
    console.error('Ошибка getUserResults:', err);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};

module.exports = { 
  getAllTests, 
  getTestById, 
  submitTest, 
  getUserResults 
};