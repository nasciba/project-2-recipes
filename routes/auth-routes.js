// routes/auth-routes.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const nodemailer = require("nodemailer");
const templates = require("../templates/template");

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  // const email = req.body.email;
  // const password = req.body.password;

  // if (email === "" || password === "") {
  //   res.render("auth/signup", { message: "Indicate email and password" });
  //   return;
  // }
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let token = '';

  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  if (email === "") {
    res.render("auth/signup", { message: "Indicate email and password" });
    return;
  }

  User.findOne({ email })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { message: "The email already exists" });
        return;
      } else {
          const newUser = new User({
          email,
          confirmationCode: token,
          status: 'Pending_Confirmation'
        });

        newUser.save((err) => {
          if (err) {
            res.render("auth/signup", { message: "Something went wrong" });
          } else {
            res.redirect("/");
          }
        });

        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'ratatouillereceitas@gmail.com',
            pass: process.env.EMAILPSSWD
          }
        });

        let message = 'Seja bem vindo, favor confirme o seu cadastro clicando';
        let subject = 'Confirmação de cadastro';

        transporter.sendMail({
          from: '"Receitinhas Ratatouille 🥗🍣🥙" <ratatouillereceitas@gmail.com>',
          to: email,
          subject: subject,
          text: message,
          html: `<b>${message} <a href="http://localhost:3004/auth/${token}">aqui</a></b>`
          //html: templates.templateExample(message),
        })
          .then()
          .catch(error => console.log(error));

      }

    })
    .catch(error => {
      next(error)
    })

});

router.get('/auth/:confirmationToken', (req, res) => {
  let userToken = req.params.confirmationToken;

  User.findOne({ "confirmationCode": userToken })
    .then(user => {
      if (user !== null) {

        User.updateOne(
          { "email": user.email },
          { $set: { "status": "Active" } }
        )
          .then(() => {
            console.log('E-mail confirmado, criar senha');
            res.render('auth/createPassword', {email: user.email});
            return;
          })
          .catch((error) => {
            console.log("falha ao atualizar o perfil");
          })

      } else {
        res.render("auth/confirmation", { message: "Cadastro não realizado!" });
      }
    })
    .catch(error => {
      next(error)
    })

});

router.post('/auth/createPassword', (req, res) => {
  console.log('entrou');
  const email = req.body.email;
  const psswd = req.body.psswd;
  const confPsswd = req.body.confPsswd;
  if (psswd == "" || confPsswd == "") {
    res.render('auth/createPassword', {
        message: "Preencha a senha para continuar",
        email: email
    });
    return;
  }
  
  if(psswd === confPsswd) {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(psswd, salt);
    User.updateOne(
      {"email": email},
      { $set: { "password": hashPass } }
      )
      .then(() => {
        console.log('Senha criada');
        res.send("Senha Criada com sucesso.");
        return;
      })
      .catch((error) => {
        console.log("falha ao criar a senha");
      })
  }
  // res.send("auth/createPassword")
})

router.get("/login", (req, res) => {
  res.render("auth/login", { "message": req.flash("error") });
});


router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
    // passReqToCallback: true
  }));


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/private-page",
    failureRedirect: "/" // here you would redirect to the login page using traditional login approach
  })
);


module.exports = router;