const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const messageRoutes = express.Router();
const port = 5000;

let Message = require("./message.model");
let User = require("./user.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/guestbook", {
  useNewUrlParser: true,
});
const connection = mongoose.connection;

connection.once("open", function () {
  console.log("mongodb connection established successfully");
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
