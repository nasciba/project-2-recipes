require('dotenv').config();

const session = require("express-session");
const bcrypt = require('bcrypt');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require("connect-mongo")(session);
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const flash = require("connect-flash");
const hbs = require('hbs');
const port = process.env.PORT;
const User = require("./models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: "our-passport-local-strategy-app",
    resave: true,
    saveUninitialized: true
}));

passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  
  passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });
  
  app.use(flash());
  passport.use(new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
    //passwordField: 'passwd',
    // passReqToCallback: true
  }, (req, email, password, next) => {
    User.findOne({ email }, (err, user) => {
      if (err) {
        console.log('error 1');
        return next(err);
      }
      if (!user) {
        console.log('error 2');
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }
  
      return next(null, user);
    });
  }));

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        // to see the structure of the data in received response:
        console.log("Google account details:", profile);
  
        User.findOne({ googleID: profile.id })
          .then(user => {
            if (user) {
              done(null, user);
              return;
            }
  
            User.create({ googleID: profile.id })
              .then(newUser => {
                done(null, newUser);
              })
              .catch(err => done(err)); // closes User.create()
          })
          .catch(err => done(err)); // closes User.findOne()
      }
    )
  );

app.use(passport.initialize());
app.use(passport.session());

mongoose.Promise = Promise;

mongoose
    .connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to Mongo!')
    }).catch(err => {
        console.error('Error connecting to mongo', err)
    });

// ...other code

// Routes
// const router = require("./routes/auth-routes");
app.use('/', require("./routes/auth-routes"));
app.use('/', require("./routes/site-routes"));

app.listen(port, () => console.log(`My bcrypt project is running at port ${port}!`));