const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./db/schemas/user-schema");

mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.2laut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
);

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res, next) => {
  try {
    const { username } = req.body;

    const user = await User.create({ username });

    res.json(user);
  } catch (err) {}
});

app.get("/api/users/:_id/logs", async (req, res, next) => {
  try {
    const user = await User.find({ _id: req.params._id });
  } catch (err) {}
});

app.post("/api/users/:id/exercises", async (req, res, next) => {
  try {
  } catch (err) {}
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
