const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const postValidator = require("../../validation/post");
const Post = require("../../models/post");
const Profile = require("../../models/profile");
router.get("/test", (req, resp) => {
  resp.json({ msg: "Post works" });
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = postValidator(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    console.log(req.body.avatar);

    newPost.save().then(post => res.json(post));
  }
);

//@route GET api/posts/:id
//@desc get post by id
//@access public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err));
});

//@route GET api/posts
//@desc Get posts
//@access Public

router.get("/", (req, res) => {
  Post.find({})
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noposts: "No posts found" }));
});

//@route DELETE api/post/:id
//@desc Delete post
//@access private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          console.log(post.user);
          console.log(req.user);
          if (post.user.toString() !== req.user.id) {
            res.status(401).json({ notauthorized: "User not authorized" });
          }

          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ Postnotfound: "Post not found" }));
    });
  }
);

//@route  POST api/posts/like/:id
//@desc Like post
//@access Private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (!profile) {
        res.status(404).json({ nouser: "User not found" });
      }
      Post.findById(req.params.id).then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.users.id)
            .length > 0
        ) {
          res
            .status(400)
            .json({ alreadyLiked: "This post is already liked by you" });
        }

        posts.likes.unshift({ user: req.user.id });
        post
          .save()
          .then(post => res.json(post))
          .catch(err => {
            res.status(400).json({ notfound: "Post not found" });
          });
      });
    });
  }
);

//@route POST api/posts/unlike/:id
//@desc  unlike a post
//@access private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (!profile) {
        res.status(404).json({ noprofile: "This profile doesnt exists" });
      }

      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.params.id)
              .length === 0
          ) {
            res.status(400).json({ notliked: "You have not liked this post" });
          }
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          post.likes.splice(removeIndex, 1);
          post.save.then(post => res.json(post));
        })
        .catch(err => {
          res.status(404).json({ Postnotfound: "No post found" });
        });
    });
  }
);

module.exports = router;
