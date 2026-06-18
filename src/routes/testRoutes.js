const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getAllTests, 
  getTestById, 
  submitTest, 
  getUserResults 
} = require('../controllers/testController');

router.get('/', getAllTests);
router.get('/my-results', auth, getUserResults);

router.get('/:id', getTestById);
router.post('/:id/submit', auth, submitTest);

module.exports = router;