require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const messageRoutes = express.Router();
const port = process.env.PORT;

const Message = require("./models/message.model");
const User = require("./models/user.model");

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

app.post("/login", (req, res) => {
  const userLoggingIn = req.body;
  User.findOne({ username: userLoggingIn.username }).then((dbUser) => {
    if (!dbUser) {
      return res.json({ message: "User doesn't exist" });
    }
    bcrypt
      .compare(userLoggingIn.password, dbUser.password)
      .then((isCorrect) => {
        if (isCorrect) {
          const payload = {
            id: dbUser._id,
            username: dbUser.username,
          };
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 86400 },
            (err, token) => {
              if (err) return res.json({ message: err });
              return res.json({
                message: "Success",
                token: "Bearer" + token,
                isLoggedIn: true,
              });
            }
          );
        } else {
          return res.json({
            message: "Invalid password",
          });
        }
      });
  });
});

app.get("/isUserAuth", async (req, res, next) => {
  const token = req.headers["x-access-token"]?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.json({
          isLoggedIn: false,
          message: "failed to authenticate",
        });
      req.user = {};
      req.user.id = decoded.id;
      req.user.username = decoded.username;
      return res.json({
        isLoggedIn: true,
        message: "authenticated successfully",
      });
      next();
    });
  } else {
    res.json({ message: "Incorrect Token", isLoggedIn: false });
  }
});

messageRoutes.route("/").get(function (req, res) {
  Message.find(function (err, messages) {
    if (err) console.error(err);
    else res.json(messages);
  });
});

messageRoutes.route("/:id").get(function (req, res) {
  const id = req.params.id;
  Message.findById(id, function (err, message) {
    res.json(message);
  });
});

messageRoutes.route("/create").post(function (req, res) {
  const message = new Message(req.body);
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
