const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const jwtsecret = config.get('jwtSecret');

// @route    POST api/users
// @desc     Register a User
// @access   Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //to store info of post request
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });
      //if user already exist send msg
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'user already exists' }] });
      }

      //create gravator
      const options = {
        s: '200',
        r: 'pg',
        d: 'mm',
      };
      const avatar = gravatar.url(email, options);

      user = new User({
        name,
        email,
        password,
        avatar,
      });

      //encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save user in db
      await user.save();

      //Return jwt token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, jwtsecret, { expiresIn: 360000 }, (err, token) => {
        if (err) {
          console.log('ERRROR IN JWT SECRET');
          console.log(err);
          throw err;
        }
        res.json({ token });
      });
    } catch (err) {
      console.log(err);
      console.log('error in POST api/users');
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
