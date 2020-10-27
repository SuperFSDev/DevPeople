const express = require('express');
const router = express.Router();

// @route    GET api/posts
// @desc     Get user by token
// @access   Private
router.get('/', async (req, res) => res.send('working'));

module.exports = router;
