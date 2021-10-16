// Imports //
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Initializing App Middlewares //
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Database Initialization //
const PORT = process.env.PORT || 5000;
const URI = process.env.URL;
const OPTIONS = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose
  .connect(URI, OPTIONS)
  .then(() => console.log("Connected To DB!"))
  .catch((err) => console.log(err));

// Database Schema Models //
const Users = mongoose.model("users", {
  userId: String,
  userName: String,
  password: String,
});
const Events = mongoose.model("events", {
  userId: String,
  title: String,
  start: String,
  end: String,
  id: String,
});

// API Endpoints //
// HOME //
app.get("/", (req, res) => {
  var data = {
    info: "AvailableEndpoints",
    login: "/login",
    addANewUser: "/user/add",
    getEventsList: "/events",
    getEventById: "/events/id",
    addEvent: "event/add",
    updateEvent: "event/update",
  };
  res.send(data);
});

// Login //
app.post("/login", async (req, res) => {
  var data = await Users.find({ userName: req.body.userName });
  if (data.length > 0) {
    if (data[0].password === req.body.password) {
      res.send({ login: "Success", userId: data[0].userId });
    } else {
      res.send({ login: "Failed" });
    }
  } else {
    res.send({ login: "Failed" });
  }
});

// Signup //
app.post("/user/add", async (req, res) => {
  var data = await Users.find({ userName: req.body.userName });
  if (data.length > 0) {
    res.send({ signup: "Failed", error: "Username already taken!!" });
  } else if (req.body.password !== req.body.rePassword) {
    res.send({ signup: "Failed", error: "Passwords do not match!!" });
  } else {
    const newUse = new Users({
      userId: req.body.userId,
      userName: req.body.userName,
      password: req.body.password,
    });

    newUse.save(function (err) {
      if (err) {
        console.log(err);
        res.send({ signup: "Failed", error: err });
      } else {
        res.send({ signup: "Success" });
      }
    });
  }
});

// Get Events List //
app.get("/events", async (req, res) => {
  var data = await Events.find();
  res.send(data);
});

// Get Event By Id //
app.get("/events/:id", async (req, res) => {
  var data = await Events.find({ userId: req.params.id });
  res.send(data);
});

// Add New Event //
app.post("/event/add", async (req, res) => {
  const newEvent = new Events({
    userId: req.body.userId,
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    id: req.body.id,
  });

  newEvent.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Success");
    }
  });
});

// Update Old Events //
app.put("/event/update", async (req, res) => {
  var response = await Events.updateOne(
    { id: req.body.id },
    {
      title: req.body.title,
      start: req.body.start,
      end: req.body.end,
    }
  );
  res.send(response);
});

// Starting Server at PORT //
app.listen(PORT, () => {
  console.log("Server is listening at port:" + PORT);
});
