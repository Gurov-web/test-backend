const { Test, Question } = require("../models");

const createTest = async (req, res) => {
    try {
        const { title, description, category, questions } = req.body;

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ msg: 'Необходимо передать массив questions' });
        }

        const test = await Test.create({
            title,
            description,
            category,
            createdBy: req.user.id
        });

        const questionPromises = questions.map(q =>
            Question.create({
                testId: test.id,
                type: q.type || 'multiple',           // ← важно
                questionText: q.questionText,
                codeSnippet: q.codeSnippet || null,   // ← важно
                options: q.options,
                correctIndex: q.correctIndex
            })
        );

        await Promise.all(questionPromises);

        res.status(201).json({ msg: 'Тест успешно создан', testId: test.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
};

const getAdminTests = async (req, res) => {
  try {
    const tests = await Test.findAll({
      include: [{ model: Question }],
    });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ msg: "Ошибка сервера" });
  }
};

const updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, questions } = req.body;

        const test = await Test.findByPk(id);
        if (!test) return res.status(404).json({ msg: 'Тест не найден' });

        await test.update({ title, description, category });

        // Удаляем старые вопросы
        await Question.destroy({ where: { testId: id } });

        if (questions && questions.length > 0) {
            const promises = questions.map(q =>
                Question.create({
                    testId: id,
                    type: q.type || 'multiple',           // ← важно
                    questionText: q.questionText,
                    codeSnippet: q.codeSnippet || null,   // ← важно
                    options: q.options,
                    correctIndex: q.correctIndex
                })
            );
            await Promise.all(promises);
        }

        res.json({ msg: 'Тест успешно обновлён' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
};

const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findByPk(id);
    if (!test) return res.status(404).json({ msg: "Тест не найден" });
    await test.destroy();
    res.json({ msg: "Тест удалён" });
  } catch (err) {
    res.status(500).json({ msg: "Ошибка сервера" });
  }
};

const { User, TestResult } = require("../models");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role", "createdAt"],
      where: { role: "user" },
      order: [["createdAt", "DESC"]],
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Ошибка сервера" });
  }
};

const getUserResultsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await TestResult.findAll({
      where: { userId },
      include: [
        {
          model: Test,
          attributes: ["id", "title", "category"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Ошибка сервера" });
  }
};

module.exports = {
  createTest,
  getAdminTests,
  updateTest,
  deleteTest,
  getAllUsers,
  getUserResultsById,
};
