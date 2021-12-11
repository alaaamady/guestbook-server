const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const messageRoutes = express.Router();
const port = 5000;

let Message = require("./models/message.model");
let User = require("./models/user.model");

app.use(cors());
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/guestbook", {
  useNewUrlParser: true,
});
const connection = mongoose.connection;

connection.once("open", function () {
  console.log("mongodb connection established successfully");
});

app.post("/signup", async (req, res) => {
  const user = req.body;

  const takenUsername = await User.findOne({ username: user.username });
  if (takenUsername) {
    res.json({ message: "Username has already been taken" });
  } else {
    user.password = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: user.username.toLowerCase(),
      password: user.password,
    });

    newUser.save();
    res.json({ message: "new user has been created successfuly" });
  }
});

messageRoutes.route("/").get(function (req, res) {
  Message.find(function (err, messages) {
    if (err) console.error(err);
    else res.json(messages);
  });
});

messageRoutes.route("/:id").get(function (req, res) {
  let id = req.params.id;
  Message.findById(id, function (err, message) {
    res.json(message);
  });
});

messageRoutes.route("/create").post(function (req, res) {
  let message = new Message(req.body);
  message
    .save()
    .then((message) => {
      res.status(200).json({ message: "message posted successfully" });
    })
    .catch((err) => {
      res.status(400).send("posting message failed");
    });
});

messageRoutes.route("/edit/:id").post(function (req, res) {
  Message.findById(req.params.id, function (err, message) {
    if (!message) res.status(404).send("message is not found");
    else message.message_title = req.body.message_title;
    message.message_content = req.body.message_content;

    message
      .save()
      .then((message) => {
        res.json("Message edited");
      })
      .catch((err) => {
        res.status(400).send("Editing Failed");
      });
  });
});

app.use("/messages", messageRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
