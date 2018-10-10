const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Loading profile model
const Profile = require("../../models/profile");

//Loading User model
const User = require("../../models/user");

router.get("/test", (req, resp) => {
  resp.json({ msg: "Profile works" });
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(user => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => {
        res.status(404).json(errors);
        console.log(err);
      });
  }
);
module.exports = router;
