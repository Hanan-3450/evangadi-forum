require("dotenv").config();

const express = require("express");
const app = express();
const port = 5500;

// dbConnection
const dbConnection = require("./db/dbConfig");

// user routes middleware file
const userRoutes = require("./routes/userRoutes");

// question routes middleware file
const questionsRoutes = require("./routes/questionRoute");

// answer routes middleware file
const answerRoutes = require("./routes/answerRoute");

// json middleware to extract json  data
app.use(express.json());
// user routes middleware
app.use("/api/users", userRoutes);

// questions routes middleware ??
app.use("/api/question", questionsRoutes);

// answers routes middleware ??
app.use("/api/answer", answerRoutes);

async function start() {
  try {
    const result = await dbConnection.execute("select  'test'  ");
    await app.listen(port);
    console.log("database connection established");
    console.log(`listening on ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}

start();
