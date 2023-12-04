const router =  require('express').Router();
const User = require('../models/users');

// Get all users
router.route('/all').get(async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  });
// Get the count of all users
router.get('/count', async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      res.json(userCount);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Add a new User
router.route('/add').post(async (req, res) => {
    const { email, username, hashed_password, admin_privileges } = req.body;
  
    try {
      const newUser= new User({
        email,
        username,
        hashed_password,
        admin_privileges,
      });
  
      await newUser.save();
      res.json('User Added!');
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  });


  module.exports = router;
