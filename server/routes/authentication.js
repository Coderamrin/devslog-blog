const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../model/User');

//sign up: create user
router.get('/', (req, res) => res.send('Auth'));

router.post('/sign-up', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  try {
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: `could not sign up: ${err}` });
  }
});

// traditional route handler, passed req/res
router.post("/login", function(req, res, next) {

  // generate the authenticate method and pass the req/res
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/'); }

    // req / res held in closure
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send(user);
    });

  })(req, res, next);

});

//log out
router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: 'log out successfully' });
  });
});

module.exports = router;
