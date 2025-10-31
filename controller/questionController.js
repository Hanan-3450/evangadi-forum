const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function postQuestion(req, res) {
  const { title, desrciption, tag } = req.body;
  const userid = req.user.userid;
  if (!title || !desrciption) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }
  const questionid =
    "qid_" + Math.random().toString(36).substr(2, 9) + Date.now();
  try {
    await dbConnection.query(
      "INSERT INTO questions (questionid, userid, title, desrciption, tag) VALUES (?, ?, ?, ?, ?)",
      [questionid, userid, title, desrciption, tag || null]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Question created successfully", questionid });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function getAllQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query(
      `SELECT 
          q.id AS id,
          q.questionid,
          q.title,
          q.desrciption,
          q.tag,
          u.username as user_name
        FROM questions q
        JOIN users u ON q.userid = u.userid
        ORDER BY q.id DESC`
    );
    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "No questions found.",
      });
    }
    return res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function getQuestionById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await dbConnection.query(
      "SELECT id, questionid, title, desrciption, userid, tag FROM questions WHERE id=?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }
    return res.status(StatusCodes.OK).json({ question: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { postQuestion, getAllQuestions, getQuestionById };
