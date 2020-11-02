const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    Test route
// @access  Public <- meaning we don't need a token to be able to access to a specific route to e.g. add a profile
router.get('/', (req, res) => res.send('User route'));

module.exports = router;