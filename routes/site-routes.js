require('dotenv').config();
const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const axios = require("axios");
const RandomRecipe = require("../models/random-recipe");
const User = require("../models/user");
const APIHandler = require("./APIHandler");
const newRecipe = require("../models/createRecipe")


const recipesAPI = new APIHandler('http://localhost:8000');


router.get("/", (req, res, next) => {
  const { user } = req.session;

  RandomRecipe.find({ $text: { $search: "pasta salad soup macaroni spaghetti noodles" } }).limit(9)
    .then(recipes => {
      // console.log(recipes)
      // res.render('soups', { recipes })
      res.render("home", { user,   user: req.user, recipes });

    })
    .catch(error => {
      console.log(error);
    })

  // res.render("home", { user,   user: req.user });
});



router.post("/favorite/:recipeId", (req, res, next) => {

  //verifica se o usuário está logado
  if(req.session.passport){
    // console.log("user logged");
    let recipeId = req.params.recipeId;
    // console.log(recipeId);

    //procura por usuário e suas receitas favoritadas
    User.find({_id: req.session.passport.user, favoriteRecipe: recipeId}).then(ans =>{     

      //Adiciona a receita se ela não estiver na lista de favoritas do usuário 
      if(ans.length == 0){
        User.updateOne({ _id: req.session.passport.user }, { $push: { favoriteRecipe: recipeId} })
        .then(user => {
          // console.log('recipe added to user');
        })
        .catch(error => {
          console.log(error);
        });
        // console.log('recipe it is not on the list');
      //remove a receita caso ela esteja na lista de favoritas do usuário
      }else{
        User.updateOne({ _id: req.session.passport.user }, { $pull: { favoriteRecipe: recipeId} })
        .then(user => {
          // console.log('recipe added to user');
        })
        .catch(error => {
          console.log(error);
        });
        // console.log('recipe it is already on the list');
      }
    }).catch(err => {
      console.log('favorite/:recipeId ', err);
    });    
    //retorna true para confirmar que o usuário está logado
    res.send(true);
  }else{
    // console.log("user not logged");
    // retorna false para confirmar que o usuário não está logado
    res.send(false);
  } 
  
});

router.get("/recipes-api", /*ensureLogin.ensureLoggedIn(),*/(req, res) => {

  let numberOfRecipes = 300;

  axios({
    "method": "GET",
    "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random",
    "headers": {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": process.env.FOOD_NUTRITION_HOST,
      "x-rapidapi-key": process.env.FOOD_NUTRITION_KEY
    }, "params": {
      "number": `${numberOfRecipes}`
    }
  })
    .then((response) => {
      let recipes = response.data.recipes;
      // res.send({response});

      recipes.forEach(recipe => {

        // titulo da receita vinda da API
        let titleRecipe = recipe.title;

        // procura receita no banco pelo titulo
        RandomRecipe.findOne({ 'title': titleRecipe })
          .then(rec => {

            // se a receita não existe no banco, ela é inserida
            if (rec == null) {

              console.log('A receita ' + titleRecipe + ' nao existe!')
              const newRandomRecipe =
                new RandomRecipe({
                  vegetarian: recipe.vegetarian,
                  vegan: recipe.vegan,
                  glutenFree: recipe.glutenFree,
                  dairyFree: recipe.dairyFree,
                  veryHealthy: recipe.veryHealthy,
                  cheap: recipe.cheap,
                  veryPopular: recipe.veryPopular,
                  sustainable: recipe.sustainable,
                  weightWatcherSmartPoints: recipe.weightWatcherSmartPoints,
                  gaps: recipe.gaps,
                  lowFodmap: recipe.lowFodmap,
                  ketogenic: recipe.ketogenic,
                  whole30: recipe.whole30,
                  sourceUrl: recipe.sourceUrl,
                  spoonacularSourceUrl: recipe.spoonacularSourceUrl,
                  aggregateLikes: recipe.aggregateLikes,
                  spoonacularScore: recipe.spoonacularScore,
                  healthScore: recipe.healthScore,
                  creditsText: recipe.creditsText,
                  sourceName: recipe.sourceName,
                  pricePerServing: recipe.pricePerServing,
                  extendedIngredients: recipe.extendedIngredients,
                  id: recipe.id,
                  title: recipe.title,
                  readyInMinutes: recipe.readyInMinutes,
                  servings: recipe.servings,
                  image: recipe.image,
                  imageType: recipe.imageType,
                  cuisines: recipe.cuisines,
                  dishTypes: recipe.dishTypes,
                  diets: recipe.diets,
                  occasions: recipe.occasions,
                  winePairing: recipe.winePairing,
                  instructions: recipe.instructions
                });

              newRandomRecipe.save((err) => {
                if (err) {
                  console.log('erro ao salvar as receitas no banco!', err);
                } else {
                  // console.log('Sucesso as salvar as receitas no banco!');
                }
              });

            } else {
              // console.log('receita ' + titleRecipe + ' já existe!');
            }
          })
          .catch(err => {
            console.log(err);
          });

      })

    })
    .catch((error) => {
      console.log(error)
    });
  // res.render("receitas", {recipes});
  
  //retorna todas receitas do banco
  RandomRecipe.find({})
    .then(recipes => {
      res.render("recipes", { recipes, user: req.user });
    })
    .catch(err => {
      console.log(err);
    })

});


// router.get("/favorite", (req, res, next) => {

//   User.update({ email: 'mcnvrodrigues@gmail.com' }, { $push: { favoriteRecipe: "5debd0d466b3942449667fb1" } })
//     .then(user => {
//       res.send({ user });
//     })
//     .catch(error => {
//       console.log(error);
//     });

// });

// router.get("/favorites", (req, res, next) => {

//   RandomRecipe.find({ _id: "5debd0d466b3942449667fb1" })
//     .then(recipes => {
//       res.render("recipes", { recipes });
//       //console.log(recipes.title);
//     })
//     .catch(err => {
//       console.log(err);
//     });

//   console.log('session >>', req.session.passport.user);
//   User.findOne({ _id: req.session.passport.user })
//     .then(user => {
//       console.log(user);
//       // req.session.passport.givenName = user.givenName;
//     })
//     .catch(err => {
//       console.log(err);
//     })

//   console.log('session >>', req.session);

// });



// router.get("/receitas", /*ensureLogin.ensureLoggedIn(),*/(req, res) => {


//   let numberOfRecipes = 300;

//   axios({
//     "method": "GET",
//     "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random",
//     "headers": {
//       "content-type": "application/octet-stream",
//       "x-rapidapi-host": process.env.FOOD_NUTRITION_HOST,
//       "x-rapidapi-key": process.env.FOOD_NUTRITION_KEY
//     }, "params": {
//       "number": `${numberOfRecipes}`
//     }
//   })
//     .then((response) => {
//       let recipes = response.data.recipes;
//       // res.send({response});

//       recipes.forEach(recipe => {

//         const newRandomRecipe = new RandomRecipe({
//           vegetarian: recipe.vegetarian,
//           vegan: recipe.vegan,
//           glutenFree: recipe.glutenFree,
//           dairyFree: recipe.dairyFree,
//           veryHealthy: recipe.veryHealthy,
//           cheap: recipe.cheap,
//           veryPopular: recipe.veryPopular,
//           sustainable: recipe.sustainable,
//           weightWatcherSmartPoints: recipe.weightWatcherSmartPoints,
//           gaps: recipe.gaps,
//           lowFodmap: recipe.lowFodmap,
//           ketogenic: recipe.ketogenic,
//           whole30: recipe.whole30,
//           sourceUrl: recipe.sourceUrl,
//           spoonacularSourceUrl: recipe.spoonacularSourceUrl,
//           aggregateLikes: recipe.aggregateLikes,
//           spoonacularScore: recipe.spoonacularScore,
//           healthScore: recipe.healthScore,
//           creditsText: recipe.creditsText,
//           sourceName: recipe.sourceName,
//           pricePerServing: recipe.pricePerServing,
//           extendedIngredients: recipe.extendedIngredients,
//           id: recipe.id,
//           title: recipe.title,
//           readyInMinutes: recipe.readyInMinutes,
//           servings: recipe.servings,
//           image: recipe.image,
//           imageType: recipe.imageType,
//           cuisines: recipe.cuisines,
//           dishTypes: recipe.dishTypes,
//           diets: recipe.diets,
//           occasions: recipe.occasions,
//           winePairing: recipe.winePairing,
//           instructions: recipe.instructions
//         });

//         newRandomRecipe.save((err) => {
//           if (err) {
//             console.log('erro ao salvar as receitas no banco!', err);
//           } else {
//             console.log('Sucesso as salvar as receitas no banco!');
//           }
//         });

//       })
//       // res.send("receitas", {recipes});
//       res.send(recipes);
//       //console.log(recipes[0].diets)
//     })
//     .catch((error) => {
//       console.log(error)
//     });
//   // res.render("receitas", {recipes});

// });

// router.get("/recipes", (req, res) => {

//   // faz uma requisição para a API e verifica se a receita retornada
//   // não existe no banco
//   recipesAPI.getFullList()
//     .then(responseFromApi => {

//       responseFromApi.data.forEach(recipe => {

//         // titulo da receita vinda da API
//         let titleRecipe = recipe.title;

//         // procura receita no banco pelo titulo
//         RandomRecipe.findOne({ 'title': titleRecipe })
//           .then(rec => {

//             // se a receita não existe no banco, ela é inserida
//             if (rec == null) {

//               console.log('A receita ' + titleRecipe + ' nao existe!')
//               const newRandomRecipe =
//                 new RandomRecipe({
//                   vegetarian: recipe.vegetarian,
//                   vegan: recipe.vegan,
//                   glutenFree: recipe.glutenFree,
//                   dairyFree: recipe.dairyFree,
//                   veryHealthy: recipe.veryHealthy,
//                   cheap: recipe.cheap,
//                   veryPopular: recipe.veryPopular,
//                   sustainable: recipe.sustainable,
//                   weightWatcherSmartPoints: recipe.weightWatcherSmartPoints,
//                   gaps: recipe.gaps,
//                   lowFodmap: recipe.lowFodmap,
//                   ketogenic: recipe.ketogenic,
//                   whole30: recipe.whole30,
//                   sourceUrl: recipe.sourceUrl,
//                   spoonacularSourceUrl: recipe.spoonacularSourceUrl,
//                   aggregateLikes: recipe.aggregateLikes,
//                   spoonacularScore: recipe.spoonacularScore,
//                   healthScore: recipe.healthScore,
//                   creditsText: recipe.creditsText,
//                   sourceName: recipe.sourceName,
//                   pricePerServing: recipe.pricePerServing,
//                   extendedIngredients: recipe.extendedIngredients,
//                   id: recipe.id,
//                   title: recipe.title,
//                   readyInMinutes: recipe.readyInMinutes,
//                   servings: recipe.servings,
//                   image: recipe.image,
//                   imageType: recipe.imageType,
//                   cuisines: recipe.cuisines,
//                   dishTypes: recipe.dishTypes,
//                   diets: recipe.diets,
//                   occasions: recipe.occasions,
//                   winePairing: recipe.winePairing,
//                   instructions: recipe.instructions
//                 });

//               newRandomRecipe.save((err) => {
//                 if (err) {
//                   console.log('erro ao salvar as receitas no banco!', err);
//                 } else {
//                   // console.log('Sucesso as salvar as receitas no banco!');
//                 }
//               });

//             } else {
//               // console.log('receita ' + titleRecipe + ' já existe!');
//             }
//           })
//           .catch(err => {
//             console.log(err);
//           });
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });

//   //retorna todas receitas do banco
//   RandomRecipe.find({})
//     .then(recipes => {
//       res.render("recipes", { recipes, user: req.user });
//     })
//     .catch(err => {
//       console.log(err);
//     })

// });

router.get("/searchResults", (req, res) => {
  const querySearch = req.query.search;
  // console.log(querySearch);


  RandomRecipe.find({ 'extendedIngredients.name': { $all: [querySearch] } })
    .then(recipes => {
      //console.log(recipes)
      res.render("search", { recipes, user: req.user });
    })
    .catch(err => {
      console.log(err)
    })
  RandomRecipe.find({ $text: { $search: querySearch } })
    .then(recipes => {
      res.render("search", { recipes, user: req.user });
    })
})

router.get('/recipes/:id', (req, res) => {
  const id = req.params.id;

  RandomRecipe.findById(id)
    .then(recipe =>
      res.render("recipe-each", { recipe, user: req.user }),
     
    )

    .catch(error => {
      console.log(error);
    })
})



router.get('/categories', (req, res) => {
  res.render('categories', {user: req.user});
})

router.get('/vegan', (req, res) => {
  RandomRecipe.find({ vegan: true })
    .then(recipes => {
      //console.log(recipes)
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
        
        res.render('vegan', { recipes, user: req.user })
      }else{
        res.render('vegan', { recipes, user: req.user })
      } 
      // res.render('vegan', { recipes })

    })
    .catch(error => {
      console.log(error);
    })

})

router.get('/gluten-free', (req, res) => {
  RandomRecipe.find({ glutenFree: true })
    .then(recipes => {
      //console.log(recipes)
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
        
        res.render('gluten-free', { recipes, user: req.user })
      }else{
        res.render('gluten-free', { recipes, user: req.user })
      } 
      // res.render('dairy-free', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})

router.get('/desserts', (req, res) => {
  RandomRecipe.find({ $text: { $search: "chocolate jam pudding cake pie cookie oreo  brownie ice cream popsicle muffin biscuit" } })
    .then(recipes => {
      // console.log(recipes)
      res.render('desserts', { recipes, user: req.user })
    })
    .catch(error => {
      console.log(error);
    })
  // res.render('desserts',  {user: req.user}//{inserir objeto receitas desserts})
  
})

router.get('/vegetarian', (req, res) => {
  RandomRecipe.find({ vegetarian: true })
    .then(recipes => {
      //console.log(recipes)
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
        
        res.render('vegetarian', { recipes, user: req.user })
      }else{
        res.render('vegetarian', { recipes, user: req.user })
      }    
      // res.render('vegetarian', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})

router.get('/dairy-free', (req, res) => {
  RandomRecipe.find({ dairyFree: true })
    .then(recipes => {
      //console.log(recipes)
      // res.render('dairy-free', { recipes })

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
        
        res.render('dairy-free', { recipes, user: req.user })
      }else{
        res.render('dairy-free', { recipes, user: req.user })
      }     

    })
    .catch(error => {
      console.log(error);
    })
})

router.get('/healthy', (req, res) => {
  RandomRecipe.find({ veryHealthy: true })
    .then(recipes => {
      //console.log(recipes)

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
        
        res.render('healthy', { recipes, user: req.user })
      }else{
        res.render('healthy', { recipes, user: req.user })
      }      

    })
    .catch(error => {
      console.log(error);
    })
})

// { field: { $in: [<value1>, <value2>, ... <valueN> ] } }
router.get('/salads', (req, res) => {
  RandomRecipe.find({ $text: { $search: "salad" } })
    .then(recipes => {
      // console.log(recipes)
      res.render('salad', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})
router.get('/pasta', (req, res) => {
  RandomRecipe.find({ $text: { $search: "pasta macaroni spaghetti noodles" } })
    .then(recipes => {
      // console.log(recipes)
      res.render('pasta', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})
router.get('/meat', (req, res) => {
  RandomRecipe.find({ $text: { $search: "meat beef bacon steak turkey ham chicken pork branzino squid seafood shrimp fish salmon" } })
    .then(recipes => {
      // console.log(recipes)
      res.render('meat', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})
router.get('/soups', (req, res) => {
  RandomRecipe.find({ $text: { $search: "soup" } })
    .then(recipes => {
      // console.log(recipes)
      res.render('soups', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})
router.get('/drinks', (req, res) => {
  RandomRecipe.find({ $text: { $search: "smoothie juice cocktail" } })
    .then(recipes => {
      // console.log(recipes)
      res.render('drinks', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})
module.exports = router;