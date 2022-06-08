require('dotenv').config();
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./model/User');

const app = express();
const mongoose = require('mongoose');

//DB config
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (err) => console.log(err));
db.once('open', () => console.log('DB connected successfully :)'));

//request body as json config
app.use(express.json());

//cors config
app.use(cors());

//authentication

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//routes config
//blog routes
const blogRouter = require('./routes/blog');
app.use('/blog', blogRouter);

//auth routes
const authRouter = require('./routes/authentication');
app.use('/user', authRouter);

//Server config
app.listen(5000, () => console.log('server running on port:5000'));
