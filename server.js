const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");
const db = require("./config/keys");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    db.mongoURI,
    { user: db.user, pass: db.pass }
  )
  .then(() => {
    console.log("Mongo connected");
  })
  .catch(error => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port: ${port} `);
});
