const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const db = require("./config/keys");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

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

//Passport middleware

app.use(passport.initialize());

// Passport Config File
require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port: ${port} `);
});
