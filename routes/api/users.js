const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
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

module.exports = router;
