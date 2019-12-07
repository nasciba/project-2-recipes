require('dotenv').config();
const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const axios = require("axios");
const RandomRecipe = require("../models/random-recipe");
const APIHandler = require("./APIHandler");

const recipesAPI = new APIHandler('http://localhost:8000');

  router.get("/", (req, res, next) => {
      res.render("home");
  });

  router.get("/recipes", (req, res) => {

    // faz uma requisição para a API e verifica se a receita retornada
    // não existe no banco
    recipesAPI.getFullList()
    .then(responseFromApi => {

      responseFromApi.data.forEach(recipe =>{

        // titulo da receita vinda da API
        let titleRecipe = recipe.title;

        // procura receita no banco pelo titulo
        RandomRecipe.findOne({'title': titleRecipe})
        .then(rec => {

          // se a receita não existe no banco, ela é inserida
          if(rec == null){

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

          }else{
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
      res.render("receitas", {recipes});
    })
    .catch(err => {
      console.log(err);
    })
    
  });

  router.get("/receitasteste", (req, res) => {

    //recupera todas as receitas do banco
    RandomRecipe.find({})
    .then(recipes => {
      
      //caso não tenha nenhuma receita no banco, buscar receitas da api
      if (recipes.length == 0){

        recipesAPI.getFullList()
        .then(responseFromApi => {
  
          responseFromApi.data.forEach(recipe =>{
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
          });         
  
        })
        .catch(err => {
            console.log(err);
        });  
      }else{
        // caso o banco não esteja vazio, fazer nova busca na api por
        // novas receitas 
        
        recipesAPI.getFullList()
        .then(responseFromApi => {
  
          responseFromApi.data.forEach(recipe =>{

            let titleRecipe = recipe.title;

            RandomRecipe.findOne({'title': titleRecipe})
            .then(rec => {
              if(rec == null){

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

              }else{
                console.log('receita ' + titleRecipe + ' já existe!');
              }
            })
            .catch();

               
          });         
  
        })
        .catch(err => {
            console.log(err);
        });         

      }
      res.render("receitas", {recipes});
    })
    .catch(); 
  });


  router.get("/receitas", /*ensureLogin.ensureLoggedIn(),*/ (req, res) => {   
    
    
    let numberOfRecipes = 1;      
    
    axios({
        "method":"GET",
        "url":"https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":process.env.FOOD_NUTRITION_HOST,
        "x-rapidapi-key":process.env.FOOD_NUTRITION_KEY
        },"params":{
        "number": `${numberOfRecipes}`,
        "tags":"vegetarian%2Cdessert"
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
            res.render("receitas", {recipes});
            //res.send(recipes);
            //console.log(recipes[0].diets)
        })
        .catch((error)=>{
          console.log(error)
        });
    // res.render("receitas", {recipes});
    
  });

module.exports = router;