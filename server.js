const express = require("express");
const path = require("path");
const fs = require("fs/promises");

const app = express();
const PORT = process.env.PORT || 6767;

// Is the test active?
let isActive = false;

const HERE = __dirname;
const DATAFOLDER = path.join(HERE, "data");
const QUESTIONDB = path.join(DATAFOLDER, "questions.json");
const ANSWERDB = path.join(DATAFOLDER, "answers.json");
const USERDB = path.join(DATAFOLDER, "users.json");

/*
id
question
choices
answer
*/

async function getQuestions() {
  const raw = await fs.readFile(QUESTIONDB, "utf-8");
  const jsonFile = JSON.parse(raw);
  return jsonFile;
}

async function getAnswers() {
  const raw = await fs.readFile(ANSWERDB, "utf-8");
  const jsonFile = JSON.parse(raw);
  return jsonFile;
}
async function getUsers() {
  const raw = await fs.readFile(USERDB, "utf-8");
  const jsonFile = JSON.parse(raw);
  return jsonFile;
}
async function saveUsers(self) {
  await fs.writeFile(USERDB, JSON.stringify(self, null, 4), "utf-8");
}

async function saveAnswers(self) {
  await fs.writeFile(ANSWERDB, JSON.stringify(self, null, 4), "utf-8");
}

app.use(express.static("public"), express.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/actions/quiz", (req, res) => {
  res.status(200);
  res.send({ isActive: isActive });
});

app.patch("/actions/quiz", (req, res) => {
  if (!req.body.isActive) {
    res.status(401);
    res.send("Bad Request");
  }
  isActive = req.body.isActive;
  res.status(200);
  res.send();
});

app.get("/questions", async (req, res) => {
  res.status(200).send(await getQuestions());
});

app.get("/users", async (req, res) => {
  res.status(200).send(await getUsers());
});

app.patch("/users/:id/test-status", async (req, res) => {
  const users = await getUsers();
  const userIdx = users.findIndex((u) => u.name === req.params.id);

  if (!users[userIdx]) {
    res.status(404).send("User not found");
  }
  users[userIdx].hasDone = true;
  saveUsers(users);
  res.status(200).send("Succesful Update!");
});

app.post("/answers/:id", async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  const answers = await getAnswers();
  const users = await getUsers();
  const user = users.find((u) => u.id === req.params.id);
  answers[req.params.id] = req.body;
  saveAnswers(answers);
  res.status(200).send("Successfully saved the answers");
});

app.get("/answers/:id", async (req, res) => {
  const answers = await getAnswers();
  const answer = answers[req.params.id];
  if (!answer) {
    res.status(204).send([]);
  }
  res.status(200).send(answer);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
