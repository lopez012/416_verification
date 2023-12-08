const bcrypt = require('bcrypt');
const router =  require('express').Router();
const User = require('../models/users');
const saltRounds = 10;

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
    const { email, username, password, role } = req.body;


  
    try {
      const hashed_password = await bcrypt.hash(password, saltRounds);


      const newUser= new User({
        email,
        username,
        hashed_password,
        role,
      });
  
      await newUser.save();
      res.json('User Added!');
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  });
  
  router.route('/login').post(async (req,res)=>{
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            //no user found
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isvalidPassword = await bcrypt.compare(password, user.hashed_password);
        if (!isvalidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        //valid login
        
      
        req.session.user = { id: user._id, email: user.email,username: user.username, role: user.role, reputation: user.reputation, member_since: user.member_since };
        //res.cookie( user._id, { httpOnly: true, secure: true});
        res.status(200).json({
            message: "User Logged in ",
            user: { id: user.email, email: user.email,username: user.username, role: user.role, reputation: user.reputation, member_since: user.member_since }
        });
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ message: 'Error: ' + err });
    }
  });
  router.route('/verify-session').get((req,res)=>{
    if (req.session.user) {
      res.json({ sessionValid: true, user: req.session.user });
  } else {
      res.json({ sessionValid: false });
  }

  });



  router.route('/logout').get(async (req,res)=>{
    req.session.destroy(err => {
      if (err) {
          res.status(400).send('Unable to log out');
      } else {
          res.send('Logout successful');
      }
  });
  });




  module.exports = router;
