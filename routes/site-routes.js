require('dotenv').config();
const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const axios = require("axios");
const RandomRecipe = require("../models/random-recipe");
const Recipes = require("./data");
const APIHandler = require("./APIHandler");

const recipesAPI = new APIHandler('http://localhost:8000');

  router.get("/", (req, res, next) => {
      res.render("home");
  });


  router.get("/receitas", /*ensureLogin.ensureLoggedIn(),*/ (req, res) => {
    
    let numberOfRecipes = 20; 
    
    recipesAPI.getFullList()
      .then(responseFromApi => {
        let recipes = responseFromApi.data;

        responseFromApi.data.forEach(recipe =>{
          console.log(recipe.title);
          
        });
        res.render("receitas", {recipes});

      })
      .catch(err => {

      });

    // let recipes = Recipes;
    // console.log(recipes[0].vegetarian);
    

    // recipes.forEach( recipe => {    
              
    //   console.log('DishTypes ', recipe.dishTypes) 
    //   console.log('Diets ', recipe.diets)      

    //   const newRandomRecipe = new RandomRecipe({
    //       vegetarian: recipe.vegetarian,
    //       vegan: recipe.vegan,
    //       glutenFree: recipe.glutenFree,
    //       dairyFree: recipe.dairyFree,
    //       veryHealthy: recipe.veryHealthy,
    //       cheap: recipe.cheap,
    //       veryPopular: recipe.veryPopular,
    //       sustainable: recipe.sustainable,
    //       weightWatcherSmartPoints: recipe.weightWatcherSmartPoints,
    //       gaps: recipe.gaps,
    //       lowFodmap: recipe.lowFodmap,
    //       ketogenic: recipe.ketogenic,
    //       whole30: recipe.whole30,
    //       sourceUrl: recipe.sourceUrl,
    //       spoonacularSourceUrl: recipe.spoonacularSourceUrl,
    //       aggregateLikes: recipe.aggregateLikes,
    //       spoonacularScore: recipe.spoonacularScore,
    //       healthScore: recipe.healthScore,
    //       creditsText: recipe.creditsText,
    //       sourceName: recipe.sourceName,
    //       pricePerServing: recipe.pricePerServing,
    //       // extendedIngredients: recipe.extendedIngredients,
    //       id: recipe.id,
    //       title: recipe.title,
    //       readyInMinutes: recipe.readyInMinutes,
    //       servings: recipe.servings,
    //       image: recipe.image,
    //       imageType: recipe.imageType,
    //       // cuisines: recipe.cuisines,
    //       dishTypes: recipe.dishTypes,
    //       diets: recipe.diets,
    //       occasions: recipe.occasions,
    //       // winePairing: recipe.winePairing,
    //       instructions: recipe.instructions
    //   });

      
    
    //   newRandomRecipe.save((err, recipe) => {
    //     // console.log(recipe);
    //       if (err) {
    //           console.log('erro ao salvar as receitas no banco!', err);
    //       } else {
    //           console.log('Sucesso as salvar as receitas no banco!');
    //       }
    //   });

    //   // const newRandomRecipe = new RandomRecipe({ 
    //   //   $push: { dishTypes: 'teste' } 
    //   // });

    //   // newRandomRecipe.save().then(recipe => {
    //   //   console.log(recipe);
    //   // })
    // });

        // console.log(recipes[0].vegetarian);
      
    
    // axios({
    //     "method":"GET",
    //     "url":"https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random",
    //     "headers":{
    //     "content-type":"application/octet-stream",
    //     "x-rapidapi-host":process.env.FOOD_NUTRITION_HOST,
    //     "x-rapidapi-key":process.env.FOOD_NUTRITION_KEY
    //     },"params":{
    //     "number": `${numberOfRecipes}`,
    //     "tags":"vegetarian%2Cdessert"
    //     }
    //     })
    //     .then((response)=>{
    //         let recipes = response.data.recipes;
    //         // res.send({response});

    //         recipes.forEach( recipe => {              

    //           const newRandomRecipe = new RandomRecipe({
    //               vegetarian: recipe.vegetarian,
    //               vegan: recipe.vegan,
    //               glutenFree: recipe.glutenFree,
    //               dairyFree: recipe.dairyFree,
    //               veryHealthy: recipe.veryHealthy,
    //               cheap: recipe.cheap,
    //               veryPopular: recipe.veryPopular,
    //               sustainable: recipe.sustainable,
    //               weightWatcherSmartPoints: recipe.weightWatcherSmartPoints,
    //               gaps: recipe.gaps,
    //               lowFodmap: recipe.lowFodmap,
    //               ketogenic: recipe.ketogenic,
    //               whole30: recipe.whole30,
    //               sourceUrl: recipe.sourceUrl,
    //               spoonacularSourceUrl: recipe.spoonacularSourceUrl,
    //               aggregateLikes: recipe.aggregateLikes,
    //               spoonacularScore: recipe.spoonacularScore,
    //               healthScore: recipe.healthScore,
    //               creditsText: recipe.creditsText,
    //               sourceName: recipe.sourceName,
    //               pricePerServing: recipe.pricePerServing,
    //               extendedIngredients: recipe.extendedIngredients,
    //               id: recipe.id,
    //               title: recipe.title,
    //               readyInMinutes: recipe.readyInMinutes,
    //               servings: recipe.servings,
    //               image: recipe.image,
    //               imageType: recipe.imageType,
    //               cuisines: recipe.cuisines,
    //               dishTypes: recipe.dishTypes,
    //               diets: recipe.diets,
    //               occasions: recipe.occasions,
    //               winePairing: recipe.winePairing,
    //               instructions: recipe.instructions
    //           });

    //           newRandomRecipe.save((err) => {
    //             if (err) {
    //               console.log('erro ao salvar as receitas no banco!', err);
    //             } else {
    //               console.log('Sucesso as salvar as receitas no banco!');
    //             }
    //           });
      
    //         })
    //         //res.render("receitas", {recipes});
    //         res.send(recipes);
    //         //console.log(recipes[0].diets)
    //     })
    //     .catch((error)=>{
    //       console.log(error)
    //     });
    // res.render("receitas", {recipes});
    
  });

module.exports = router;