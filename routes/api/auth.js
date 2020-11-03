const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public 

// middleware applied to protect route by adding auth before async (req, res) => {} 
router.get('/', auth, async (req, res) => {
  try {
    //                                     get user info without password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server error')
  }
});

module.exports = router;

