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
        
      
        req.session.user = { _id: user._id, email: user.email,username: user.username, role: user.role, reputation: user.reputation, member_since: user.member_since };
        //res.cookie( user._id, { httpOnly: true, secure: true});
        res.status(200).json({
            message: "User Logged in ",
            user: { _id: user._id, email: user.email,username: user.username, role: user.role, reputation: user.reputation, member_since: user.member_since }
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
  router.route('/check-existing-email').post(async (req,res)=>{
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            //no user found
            return res.json({ valid_email: true});
        }else{
          return res.json({ valid_email: false});
        }

       
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ message: 'Error: ' + err });
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
  router.route('/:id').get(async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        } else {
            return res.json(user);
        }
    } catch (err) {
        console.error('Server error:', err);
    }
});

router.route('/:id/:vote').post(async (req, res) => {
  const { id, vote } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert the string vote to a number
    const voteValue = parseInt(vote, 10);

    if (isNaN(voteValue)) {
      return res.status(400).json({ message: 'Invalid vote value' });
    }

    // Update the reputation based on the sign of the vote
    if (voteValue > 0) {
      user.reputation += voteValue;
    } else if (voteValue < 0) {
      user.reputation -= Math.abs(voteValue);
    }

    await user.save();

    res.json({ message: 'Vote processed successfully'});
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


  module.exports = router;
