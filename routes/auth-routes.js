// routes/auth-routes.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const nodemailer = require("nodemailer");
const templates = require("../templates/template");

//recipes model
const RandomRecipe = require("../models/random-recipe");

//createRecipe model
const newRecipe = require("../models/createRecipe")

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  let data = {
    layout: false
  }
  res.render("auth/signup", data);
});

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let token = '';

  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  if (email === "") {
    res.render("auth/signup", { message: "Indicate email", layout:false });
    return;
  }

  User.findOne({ email })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { message: "The email already exists", layout:false });
        return;
      } else {
          const newUser = new User({
          email,
          confirmationCode: token,
          status: 'Pending_Confirmation'
        });

        newUser.save((err) => {
          if (err) {
            res.render("auth/signup", { message: "Something went wrong", layout:false });
          } else {
            res.render("auth/verify");
          }
        });

        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'ratatouillereceitas@gmail.com',
            pass: process.env.EMAILPSSWD
          }
        });

        let message = 'Welcome to Ratatouille Recipes, click here to confirm your registration';
        let subject = 'Ratatouille Recipes 🥗 Registration';

        transporter.sendMail({
          from: '"Ratatouille Recipes 🥗🍣🥙" <ratatouillereceitas@gmail.com>',
          to: email,
          subject: subject,
          text: message,
          html: `<b>${message} <a href="${process.env.EMAIL_RESPONSE}/auth/${token}">here</a></b>`
          
        })
          .then()
          .catch(error => console.log(error));

      }

    })
    .catch(error => {
      next(error)
    })

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
  passport.authenticate(
    "google", 
    {
      // successRedirect: "/private-page",
      failureRedirect: "/" 
    }    
  ),
  function(req, res) {

    User.findOne({_id: req.session.passport.user})
    .then(user => {
      // console.log(user);
      req.session.user = user;

      // console.log('request google >>',req.session);
      res.redirect('/private-page');
    })
    .catch(err => {
      console.log(err);
    })
    
    
  }
);

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
            // console.log('E-mail confirmado, criar senha');
            res.render('auth/createPassword', {email: user.email, layout: false});
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
  // console.log('entrou');
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
        // console.log('Senha criada');
        res.render("auth/account-created");
        return;
      })
      .catch((error) => {
        console.log("falha ao criar a senha", {layout: false});
      })
  }
  
})

router.get("/login", (req, res) => {
 
  res.render("auth/login",  { "message": req.flash("error"), layout : false });
});

router.get("auth/login", (req, res) => {
  res.render("auth/login",  { "message": req.flash("error"), layout : false });
})

router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true    
  }));

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/private-page');
    
  });

router.post('/login', function(req, res, next) {
   passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
     if (!user) { return res.redirect('/login'); }
  
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        // console.log(user);
        req.session.user = { givenName : user.email }
        // console.log(req.session);
        return res.redirect('/private-page');
        
      });
    })(req, res, next);
  });


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  // console.log(req.session)
  User.findById({_id: req.session.passport.user})
    .then(usr => {      

      RandomRecipe.find({ _id: {$in: usr.favoriteRecipe} })
      .then(recipes => {

        recipes.forEach(recipe => {
          recipe.favorite = true; 
        });

        if(req.session.passport){
        
          recipes.forEach(recipe => {
            User.findOne({_id: req.session.passport.user, favoriteRecipe: recipe._id}).then(ans =>{
              if(ans !== null){              
                recipe.favorite = true;              
              }
              
            })
            .catch(err => {
              console.log(err);
            });
          });
          
          res.render("private", { user: req.user, recipes });
        }else{
          res.render("private", { user: req.user, recipes });
        } 
        
        res.render("private", { user: req.user, recipes });

      })
      .catch(error => {
        console.log('/private-page User.RandomRecipe.find ', error);
      })

    })
    .catch(error => {
      console.log('/private-page User.findById ', error);
    })
  
});

// router.get("/my-recipes", ensureLogin.ensureLoggedIn(), (req, res) => {
//   // console.log(req.session)
//   User.findById({_id: req.session.passport.user})
//     .then(usr => {      
//       User.find({createRecipe})
//       .then(recipes => {
//         res.render("my-recipes", { recipes, user: req.user });
//       })
//       .catch(err => {
//         res.render('my-recipes', console.log(err));
//       })
       

//     })
//     .catch(error => {
//       console.log('/my-recipes User.findById ', error);
//     })
  
// });  
// router.get("/my-recipes", ensureLogin.ensureLoggedIn(), (req, res) => {
//   // console.log(req.session)
// 	User.findById({_id: req.session.passport.user})
//     .then(usr => {      

//       User.find({ _id: {$in: usr.createRecipe} })
//       .then(recipes => {         
        
//         res.render("my-recipes", { user: req.user, recipes });

//       })
//       .catch(error => {
//         console.log('deu ruim ', error);
//       })

//     })
//     .catch(error => {
//       console.log('/deu ruim ', error);
//     })
  
// });
router.get("/my-recipes", (req, res, next) => {
  newRecipe.find({})
  .then(recipes => {
    res.render("my-recipes", { recipes, user: req.user });
  })
  .catch(err => {
    console.log(err);
  })
  
})

// router.get('/my-recipes/:id', (req, res, next) => {
//   const id = req.params.id;
//   newRecipe.findById(id)
//     .then(recipe => {
//       console.log(recipe),
//       res.render("my-recipe-each", { recipe, user: req.user })
     
//     })
//     .catch(error => {
//       console.log(error);
//     })
// })


router.get("/create-recipe", ensureLogin.ensureLoggedIn(), (req, res) => {
  // console.log(req.session)
  User.findById({_id: req.session.passport.user})
    .then(usr => {      
      newRecipe.find({})
      .then(recipes => {
        res.render("create-recipe", { recipes, user: req.user });
      })
      .catch(err => {
        console.log('/create-recipe User.myRecipes.find ', err);
      })
      

    })
    .catch(error => {
      console.log('/create-recipe User.findById ', error);
    })
  
});

// router.post("/create-recipe", (req, res, next) => {
//   let recipeTitle = req.body.title;
//   let timeToPrepare = req.body.readyInMinutes;
//   let listOfIngredients = req.body.ingredient;
//   let recipeDirections = req.body.directions;
//   if(req.session.passport){
//   newRecipe.create({title: recipeTitle, readyInMinutes: timeToPrepare, ingredients: listOfIngredients, directions:recipeDirections })
//   .then(recipe => { console.log('The recipe is saved and its value is: ', recipe) })
//   .catch(err => { console.log('An error happened:', err) });

//   User.updateOne({ _id: req.session.passport.user }, { $push: { createRecipe: _id} })

//   res.render('my-recipes')
//   }
//   else {
//     res.render(res.render(my-recipes));
//   }
// })

router.post("/create-recipe", (req, res, next) => {
  let recipeTitle = req.body.title;
  let timeToPrepare = req.body.readyInMinutes;
  let listOfIngredients = req.body.ingredient;
  let recipeDirections = req.body.directions;
  if(req.session.passport){
  newRecipe.create({title: recipeTitle, readyInMinutes: timeToPrepare, ingredients: listOfIngredients, directions:recipeDirections })
  .then(recipe => { 
		console.log('The recipe is saved and its value is: ', recipe) 
		User.updateOne({ _id: req.session.passport.user }, { $push: { userRecipes: recipe._id} })
		})
  .catch(err => { console.log('An error happened:', err) });

  

  res.render('my-recipes');
  }
  else {
    res.render('my-recipes');
  }
})

module.exports = router;