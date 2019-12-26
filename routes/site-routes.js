require('dotenv').config();
const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const axios = require("axios");
const RandomRecipe = require("../models/random-recipe");
const User = require("../models/user");
const APIHandler = require("./APIHandler");
const newRecipe = require("../models/createRecipe");


const recipesAPI = new APIHandler('http://localhost:8000');


router.get("/", (req, res, next) => {
  let recipesList = [];
  const { user } = req.session;
  // console.log(req.session);

  // RandomRecipe.find({}).limit(20).then(recipes => {
  //   recipes.forEach(rec => {
  //     console.log(rec._id);
  //     RandomRecipe.updateOne({_id: rec._id}, 
  //       {$set : {aggregateShares : Math.floor(Math.random() * 100), aggregateViews : Math.floor(Math.random() * 100)}}).then(()=>{console.log('sucesso')})
  //       .catch(err => {console.log(err)});
  //   })
  // })



  RandomRecipe.find({}).sort({aggregateLikes: -1}).limit(3).then(recipes => {
    recipes.forEach(rec => {
      console.log(rec._id);
      recipesList.push(rec._id);
      console.log(recipesList);
    });  

  }).catch(err => {
    console.log(err);
  });

  RandomRecipe.find({_id : {$in: recipesList}}).then(recipes =>{
    recipes.forEach(rec => {console.log(rec.title, ' - ', rec.aggregateLikes)});
  }).catch(); 

  

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
  if(req.user){
    
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
    console.log("user not logged");
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

router.get("/receitas", /*ensureLogin.ensureLoggedIn(),*/(req, res) => {


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

        const newRandomRecipe = new RandomRecipe({
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
            console.log('Sucesso as salvar as receitas no banco!');
          }
        });

      })
      // res.send("receitas", {recipes});
      res.send(recipes);
      //console.log(recipes[0].diets)
    })
    .catch((error) => {
      console.log(error)
    });
  // res.render("receitas", {recipes});

});

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
        
        res.render('desserts', { recipes, user: req.user })
      }else{
        res.render('desserts', { recipes, user: req.user })
      }       
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
        
        res.render('salad', { recipes, user: req.user })
      }else{
        res.render('salad', { recipes, user: req.user })
      } 

    })
    .catch(error => {
      console.log(error);
    })
})
router.get('/pasta', (req, res) => {
  RandomRecipe.find({ $text: { $search: "pasta macaroni spaghetti noodles" } })
    .then(recipes => {
      // console.log(recipes)
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
        
        res.render('pasta', { recipes, user: req.user })
      }else{
        res.render('pasta', { recipes, user: req.user })
      }    

    })
    .catch(error => {
      console.log(error);
    })
})
router.get('/meat', (req, res) => {
  RandomRecipe.find({ $text: { $search: "meat beef bacon steak turkey ham chicken pork branzino squid seafood shrimp fish salmon" } })
    .then(recipes => {
      // console.log(recipes)
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
        
        res.render('meat', { recipes, user: req.user })
      }else{
        res.render('meat', { recipes, user: req.user })
      } 

    })
    .catch(error => {
      console.log(error);
    })
})
router.get('/soups', (req, res) => {
  RandomRecipe.find({ $text: { $search: "soup" } })
    .then(recipes => {
      // console.log(recipes)
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
        
        res.render('soups', { recipes, user: req.user })
      }else{
        res.render('soups', { recipes, user: req.user })
      }

    })
    .catch(error => {
      console.log(error);
    })
})
router.get('/drinks', (req, res) => {
  RandomRecipe.find({ $text: { $search: "smoothie juice cocktail" } })
    .then(recipes => {
      // console.log(recipes)
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
        
        res.render('drinks', { recipes, user: req.user })
      }else{
        res.render('drinks', { recipes, user: req.user })
      } 
    })
    .catch(error => {
      console.log(error);
    })
})


router.get("/my-recipes", ensureLogin.ensureLoggedIn(), (req, res) => {
  // console.log(req.session)
	User.findById({_id: req.session.passport.user})
    .then(usr => {      

      newRecipe.find({ _id: {$in: usr.userRecipes} })
      .then(recipes => {         
        
        res.render("my-recipes", { user: req.user, recipes });

      })
      .catch(error => {
        console.log('deu ruim ', error);
      })

    })
    .catch(error => {
      console.log('/deu ruim ', error);
    })
  
});

router.get("/create-recipe", ensureLogin.ensureLoggedIn(), (req, res) => {

    User.findById({_id: req.session.passport.user})
    .then(usr => {      

      newRecipe.find({ _id: {$in: usr.userRecipes} })
      .then(recipes => {         
        
        res.render("create-recipe", { user: req.user, recipes });

      })
      .catch(error => {
        console.log('/create-recipe newRecipe', error);
      })

    })
    .catch(error => {
      console.log('/create-recipe findById ', error);
    })
  
});

router.post("/create-recipe", (req, res, next) => {

  let recipeTitle = req.body.title;
  let timeToPrepare = req.body.readyInMinutes;
  let listOfIngredients = req.body.ingredient;
  let recipeDirections = req.body.directions;

  if(req.session.passport){
  newRecipe.create({title: recipeTitle, readyInMinutes: timeToPrepare, ingredients: listOfIngredients, directions:recipeDirections })
  .then(recipe => { 
		console.log('The recipe is saved and its value is: ', recipe._id);
    User.updateOne({ _id: req.session.passport.user }, { $push: { userRecipes: recipe._id} }).then(()=> {console.log('sucesso')}).catch(err => {console.log(err);})
    
    // res.send('recipe');
		})
  .catch(err => { console.log('An error happened:', err) }); 
  
  User.findById({_id: req.session.passport.user})
    .then(usr => {      

      newRecipe.find({ _id: {$in: usr.userRecipes} })
      .then(recipes => {         
        
        res.render("my-recipes", { user: req.user, recipes });

      })
      .catch(error => {
        console.log('deu ruim ', error);
      })

    })
    .catch(error => {
      console.log('/deu ruim ', error);
    })
  

  // res.render('my-recipes');
  }
  else {
    res.render('my-recipes');
  }
})

module.exports = router;