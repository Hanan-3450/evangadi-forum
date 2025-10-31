const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");


async function postAnswer(req, res) {
  const { questionid, answer } = req.body;
  const userid = req.user.userid; 

  if (!questionid || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide answer",
    });
  }
  try {
    
    const [questionRows] = await dbConnection.query(
      "SELECT questionid FROM questions WHERE questionid = ?",
      [questionid]
    );
    if (questionRows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }

    
    const answerid = Math.random().toString(36).substring(2, 15); 

    await dbConnection.query(
      "INSERT INTO answers (answerid, userid, questionid, answer) VALUES (?, ?, ?, ?)",
      [answerid, userid, questionid, answer]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Answer posted successfully" });
  } catch (error) {
    console.error(error); // shows exact error in backend
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// Get answers for a question
async function getAnswers(req, res) {
  const { questionid } = req.params;
  try {
    const [answers] = await dbConnection.query(
      `SELECT 
         a.answerid, 
         a.answer, 
         u.username AS user_name
       FROM answers a
       JOIN users u ON a.userid = u.userid
       WHERE a.questionid = ?
       ORDER BY a.answerid ASC`,
      [questionid]
    );
    // If no answers found
    if (answers.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "No answers found for the requested question.",
      });
    }
    return res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.error(error); 
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { postAnswer, getAnswers };
