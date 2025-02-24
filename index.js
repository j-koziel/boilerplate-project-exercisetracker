const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./db/schemas/user-schema");
const Exercise = require("./db/schemas/exercise-schema");

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

app.get("/api/users", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post("/api/users", async (req, res, next) => {
  try {
    const { username } = req.body;

    const user = await User.create({ username });

    res.json(user);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get("/api/users/:_id/logs", async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id);
    const query = req.query;

    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;

    let exercises = await Exercise.find({ username: user.username });

    if (from) {
      exercises = exercises.filter((exercise) => {
        return exercise.date >= from;
      });
    }

    if (to) {
      exercises = exercises.filter((exercise) => {
        return exercise.date <= to;
      });
    }

    if (query.limit) {
      exercises = exercises.slice(0, query.limit);
    }

    exercises = exercises.map((exercise) => {
      return {
        ...exercise._doc,
        date: exercise.date.toDateString(),
      };
    });

    const response = {
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log: exercises,
    };

    res.json(response);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post("/api/users/:id/exercises", async (req, res, next) => {
  try {
    const { description, duration, date } = req.body;

    if (!description || !duration || !date) {
      return res.json({ error: "Please fill in all required fields" });
    }

    const user = await User.findById(req.params.id);

    const exercise = await Exercise.create({
      username: user.username,
      date: new Date(date),
      description,
      duration,
    });

    const response = { ...exercise._doc, date: exercise.date.toDateString() };
    res.json(response);
  } catch (err) {
    res.json({ error: err.message });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
