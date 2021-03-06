const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load validation for all
//Load proifle
const validateProfileInput = require("../../validation/profile");
//Load experience
const validateExperience = require("../../validation/experience");
//Load education
const validateEducation = require("../../validation/education");
//Loading profile model
const Profile = require("../../models/profile");

//Loading User model
const User = require("../../models/user");

// @route GET   api/profile
// @desc Get current users profile
// @access private

router.get("/test", (req, resp) => {
  resp.json({ msg: "Profile works" });
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .populate("user", ["avatar", "name"])
      .then(profile => {
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

// @route POST api/profile
// @desc Create user profile
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    //Skills  - split into an array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(", ");
    }

    profileFields.social = {};

    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;

    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;

    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "The handle already exists";
            res.status(400).json(errors);
          }

          new Profile(profileFields).save().then(profile => {
            res.json(profile);
          });
        });
      }
    });
  }
);

// @route GET api/profile/handle/:handle
// @route get profile by handle
//@access public

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no such profile";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// @route GET api/profile/handle/:handle
// @route get profile by handle
//@access public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no such profile";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.status(400).json({ profile: "There is no profile for this user" });
    });
});

//@route GET api/profile/all
//@desc Get lal proifles
//@access public

router.get("/all", (req, res) => {
  const errors = {};
  Profile.find({})
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        res.status(404).json({ errors });
      }
      res.status(200).json(profiles);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

//@route POST api/profile/experience
//@desc add experience to profile
//@access Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      const { errors, isValid } = validateExperience(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //adding to experience array
      profile.experience.unshift(newExp);
      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);
//@route POST api/profile/education
//@desc add education to profile
//@access Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      const { errors, isValid } = validateEducation(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //adding to experience array
      profile.education.unshift(newEdu);
      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

// @route  DELETE api/profile/experience/:exp_id
//@desc delete experience from profile
//@access private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      //Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      //Remove from array
      profile.experience.splice(removeIndex, 1);
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => {
          res.status(404).json(err);
        });
    });
  }
);

// @route  DELETE api/profile/education/:edu_id
//@desc delete education from profile
//@access private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      //Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      //Remove from array
      profile.education.splice(removeIndex, 1);
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => {
          res.status(404).json(err);
        });
    });
  }
);

//@route DELETE api/profile/
//@desc delete user and profile
//@private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndDelete({ user: req.user.id }).then(() => {
      User.findOneAndDelete({ _id: req.user.id }).then(() => {
        res.json({ success: true });
      });
    });
  }
);
module.exports = router;
