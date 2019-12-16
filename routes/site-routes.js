require('dotenv').config();
const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const axios = require("axios");
const RandomRecipe = require("../models/random-recipe");
const User = require("../models/user");
const APIHandler = require("./APIHandler");


const recipesAPI = new APIHandler('http://localhost:8000');


router.get("/", (req, res, next) => {
  const { user } = req.session;
  res.render("home", { user });
});

router.get("/favorite", (req, res, next) => {

  User.update({ email: 'mcnvrodrigues@gmail.com' }, { $push: { favoriteRecipe: "5debd0d466b3942449667fb1" } })
    .then(user => {
      res.send({ user });
    })
    .catch(error => {
      console.log(error);
    });

});

router.get("/favorites", (req, res, next) => {

  RandomRecipe.find({ _id: "5debd0d466b3942449667fb1" })
    .then(recipes => {
      res.render("recipes", { recipes });
      //console.log(recipes.title);
    })
    .catch(err => {
      console.log(err);
    });

  console.log('session >>', req.session.passport.user);
  User.findOne({ _id: req.session.passport.user })
    .then(user => {
      console.log(user);
      // req.session.passport.givenName = user.givenName;
    })
    .catch(err => {
      console.log(err);
    })

  console.log('session >>', req.session);

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

router.get("/recipes", (req, res) => {

  // faz uma requisição para a API e verifica se a receita retornada
  // não existe no banco
  recipesAPI.getFullList()
    .then(responseFromApi => {

      responseFromApi.data.forEach(recipe => {

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
                  console.log('Sucesso as salvar as receitas no banco!');
                }
              });

            } else {
              console.log('receita ' + titleRecipe + ' já existe!');
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    })
    .catch(err => {
      console.log(err);
    });

  //retorna todas receitas do banco
  RandomRecipe.find({})
    .then(recipes => {
      res.render("recipes", { recipes });
    })
    .catch(err => {
      console.log(err);
    })

});

router.get("/searchResults", (req, res) => {
  const querySearch = req.query.search;
  console.log(querySearch);


  RandomRecipe.find({ 'extendedIngredients.name': { $all: [querySearch] } })
    .then(recipes => {
      console.log(recipes)
      res.render("search", { recipes });
    })
    .catch(err => {
      console.log(err)
    })
  RandomRecipe.find({ $text: { $search: querySearch } })
    .then(recipes => {
      res.render("search", { recipes });
    })
})

router.get('/recipes/:id', (req, res) => {
  const id = req.params.id;

  RandomRecipe.findById(id)
    .then(recipe =>
      res.render("recipe-each", { recipe }),
     
    )

    .catch(error => {
      console.log(error);
    })
})

router.get('/categories', (req, res) => {
  res.render('categories');
})

router.get('/vegan', (req, res) => {
  RandomRecipe.find({ vegan: true })
    .then(recipes => {
      console.log(recipes)
      res.render('vegan', { recipes })

    })
    .catch(error => {
      console.log(error);
    })

})

router.get('/gluten-free', (req, res) => {
  RandomRecipe.find({ dairyFree: true })
    .then(recipes => {
      console.log(recipes)
      res.render('dairy-free', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})

router.get('/desserts', (req, res) => {
  RandomRecipe.find({ $text: { $search: "chocolate pudding cake pie cookie oreo biscuit brownie ice cream popsicle muffin" } })
    .then(recipes => {
      console.log(recipes)
      res.render('desserts', { recipes })
    })
    .catch(error => {
      console.log(error);
    })
})

router.get('/vegetarian', (req, res) => {
  RandomRecipe.find({ vegetarian: true })
    .then(recipes => {
      console.log(recipes)
      res.render('vegetarian', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})

router.get('/dairy-free', (req, res) => {
  RandomRecipe.find({ dairyFree: true })
    .then(recipes => {
      console.log(recipes)
      res.render('dairy-free', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})

router.get('/healthy', (req, res) => {
  RandomRecipe.find({ veryHealthy: true })
    .then(recipes => {
      console.log(recipes)
      res.render('healthy', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})

// { field: { $in: [<value1>, <value2>, ... <valueN> ] } }
router.get('/salads', (req, res) => {
  RandomRecipe.find({ $text: { $search: "salad" } })
    .then(recipes => {
      console.log(recipes)
      res.render('salad', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})
router.get('/pasta', (req, res) => {
  RandomRecipe.find({ $text: { $search: "pasta macaroni noodles" } })
    .then(recipes => {
      console.log(recipes)
      res.render('pasta', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})
router.get('/meat', (req, res) => {
  RandomRecipe.find({ $text: { $search: "meat beef bacon steak turkey ham chicken pork branzino squid seafood shrimp fish salmon" } })
    .then(recipes => {
      console.log(recipes)
      res.render('meat', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})
router.get('/soups', (req, res) => {
  RandomRecipe.find({ $text: { $search: "soup" } })
    .then(recipes => {
      console.log(recipes)
      res.render('soups', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})
router.get('/drinks', (req, res) => {
  RandomRecipe.find({ $text: { $search: "smoothie juice cocktail" } })
    .then(recipes => {
      console.log(recipes)
      res.render('drinks', { recipes })

    })
    .catch(error => {
      console.log(error);
    })
})
module.exports = router;