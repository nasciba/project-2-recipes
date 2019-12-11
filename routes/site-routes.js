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
  res.render("home");
});

router.get("/favorite", (req, res, next) => { 

  User.update({email: 'mcnvrodrigues@gmail.com'}, {$push: {favoriteRecipe: "5debd0d466b3942449667fb1"}})
  .then(user => {
    res.send({user});
  })
  .catch(error => {
    console.log(error);
  });

});

router.get("/favorites", (req, res, next) => { 

  RandomRecipe.find({_id: "5debd0d466b3942449667fb1"})
  .then(recipes =>{
    res.render("recipes", { recipes });
    console.log(recipes.title);
  })
  .catch(err =>{
    console.log(err);
  });

});



router.get("/receitas", /*ensureLogin.ensureLoggedIn(),*/ (req, res) => {   
    
    
  let numberOfRecipes = 100;      
  
  axios({
      "method":"GET",
      "url":"https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random",
      "headers":{
      "content-type":"application/octet-stream",
      "x-rapidapi-host":process.env.FOOD_NUTRITION_HOST,
      "x-rapidapi-key":process.env.FOOD_NUTRITION_KEY
      },"params":{
      "number": `${numberOfRecipes}`
      }
      })
      .then(  (response)=>{
          let recipes = response.data.recipes;
          // res.send({response});

          recipes.forEach( recipe => {              

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
      .catch((error)=>{
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
    RandomRecipe.find({"extendedIngredients.name": {$exists: querySearch}})
    .then(search => {
      res.send(search);
      })
    .catch(err => console.log(err))
});


// router.get("/searchResults", (req, res) => {
//   const querySearch = req.query.search;
//   console.log(querySearch);
//     RandomRecipe.find({$or : [{"extendedIngredients.name": {$exists: querySearch}}, {"title" : {$exists: querySearch} }]})
//     .then(search => {
//       res.send(search);
//       })
//     .catch(err => console.log(err))
// })

router.get('/categories', (req, res) => {
  res.render('categories');
})

router.get('/vegan', (req, res) => {
  res.render('vegan', //{inserir objeto receitas veganas}
  )
})

router.get('/gluten-free', (req, res) => {
  res.render('gluten-free', //{inserir objeto receitas gluten free}
  )
})

router.get('/desserts', (req, res) => {
  res.render('desserts', //{inserir objeto receitas desserts}
  )
})

router.get('/vegetarian', (req, res) => {
  res.render('vegetarian', //{inserir objeto receitas vegetarian}
  )
})

router.get('/dairy-free', (req, res) => {
  res.render('dairy-free', //{inserir objeto receitas dairy free}
  )
})

router.get('/cheap', (req, res) => {
  res.render('cheap', //{inserir objeto receitas dairy free}
  )
})



module.exports = router;