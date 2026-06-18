const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const {
  createTest,
  getAdminTests,
  updateTest,
  deleteTest,
  getAllUsers,
  getUserResultsById,
} = require("../controllers/adminController");

router.use(auth);
router.use(adminOnly);

router.get("/tests", getAdminTests);
router.post("/tests", createTest);
router.put("/tests/:id", updateTest);
router.delete("/tests/:id", deleteTest);

router.get("/users", getAllUsers);
router.get("/users/:userId/results", getUserResultsById);

module.exports = router;
