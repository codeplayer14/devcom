const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const postValidator = require("../../validation/post");
const Post = require("../../models/post");
router.get("/test", (req, resp) => {
  resp.json({ msg: "Post works" });
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, resp) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
