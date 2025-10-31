const express = require("express");
const router = express.Router();

// authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

const {
  postQuestion,
  getAllQuestions,
  getQuestionById,
} = require("../controller/questionController");

router.post("/", authMiddleware, postQuestion); // POST /api/question
router.get("/", getAllQuestions); // GET /api/question
router.get("/:questionid", getQuestionById); // GET /api/question/:question_id

module.exports = router;


