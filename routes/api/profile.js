const express = require('express');
const router = express.Router();
const normalizeURL = require('normalize-url');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      //check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //create profile fields
    const profileFields = { user: req.user.id };

    const mainfields = [
      'company',
      'location',
      'bio',
      'status',
      'githubusername',
      'website',
      'skills',
    ];
    mainfields.forEach((field) => {
      if (req.body[field]) {
        profileFields[field] = req.body[field];
      }
    });

    const { website, skills } = req.body;
    //handeling websites
    if (website) {
      profileFields.website = normalizeURL(website, { forceHttps: true });
    }
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
      console.log(profileFields.skills);
    }

    // Build social object and add to profileFields
    const socialfields = [
      'youtube',
      'twitter',
      'instagram',
      'linkedin',
      'facebook',
    ];
    profileFields.social = {};
    socialfields.forEach((field) => {
      if (req.user[field]) {
        profileFields.social[field] = normalize(req.body[field], {
          forceHttps: true,
        });
      }
    });

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      console.error('ERROR IN POST api/profile');
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    console.error('ERROR IN GET api/profile 118');
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user id
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      res.status(400).json({ msg: 'no profile found' });
    }
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    console.error('ERROR IN GET api/profile 118');
    res.status(500).send('Server Error');
  }
});

module.exports = router;
