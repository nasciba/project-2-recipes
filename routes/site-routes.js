require('dotenv').config();
const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const axios = require("axios");


  router.get("/receitas", /*ensureLogin.ensureLoggedIn(),*/ (req, res) => {
    
    let numberOfRecipes = 20; 
    console.log('@@@@', process.env.XRAPIDAPIKEY);

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
        .then((response)=>{
            let recipes = response.data.recipes;
            // res.send({response});
            res.render("receitas", {recipes});
          console.log(recipes)
        })
        .catch((error)=>{
          console.log(error)
        })

    
  });

module.exports = router;