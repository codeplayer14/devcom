const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const secret = require("../../config/keys").secret;
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validateRegisterInput = require("../../validation/register");
// @route GET api/users/test
// @desc Test public routes
// @access Public
router.get("/test", (req, resp) => {
  resp.json({ msg: "User works" });
});

//@route POST api/users/register
//@desc Register User
//@access Public

router.post("/register", (req, resp) => {
  //check validation

  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return resp.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return resp.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", //rating
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          else {
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                resp.json(user);
              })
              .catch(err => console.log(err));
          }
        });
      });
    }
  });
});

// @route GET api/users/login
// @desc Login User/ Return JWT
// @access Public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User email not found" });
    }
    bcrypt.compare(pass, user.password).then(isMatch => {
      if (isMatch) {
        //User matches
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        jwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
          res.json({ success: true, token: "Bearer " + token });
        });
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

// @route  GET api/users/current
// @desc returns current user
// @access Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      name: req.user.name,
      email: req.user.email,
      id: req.id
    });
  }
);

module.exports = router;
