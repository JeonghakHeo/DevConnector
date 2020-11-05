const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private 
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar']); // populate name & avatar from user model.

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile)
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile
// @desc    Create or update user profile
// @access  Private 
router.post('/',
  [auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skill is required').not().isEmpty()
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company, website, location, bio, status, githubusername,
      skills, youtube, facebook, twitter, instagram, linkedin
    } = req.body;

    // Build profile object (need to check to make sure i.e. bio is added before submitting to db)
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    profileFields.socials = {};
    if (youtube) profileFields.socials.youtube = youtube;
    if (twitter) profileFields.socials.twitter = twitter;
    if (facebook) profileFields.socials.facebook = facebook;
    if (linkedin) profileFields.socials.linkedin = linkedin;
    if (instagram) profileFields.socials.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id }); // <- user id comes from token

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

);

module.exports = router;