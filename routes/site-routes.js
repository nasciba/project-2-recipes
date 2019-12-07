require('dotenv').config();
const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const axios = require("axios");
const APIHandler = require("./APIHandler");
const recipesAPI = new APIHandler('http://localhost:8000');


router.get("/", (req, res, next) => {
  res.render("home");
});


router.get("/receitas", /*ensureLogin.ensureLoggedIn(),*/(req, res) => {

  let numberOfRecipes = 20;
  console.log('@@@@', process.env.XRAPIDAPIKEY);

  axios({
    "method": "GET",
    "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random",
    "headers": {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": process.env.FOOD_NUTRITION_HOST,
      "x-rapidapi-key": process.env.FOOD_NUTRITION_KEY
    }, "params": {
      "number": `${numberOfRecipes}`,
      "tags": "vegetarian%2Cdessert"
    }
  })
    .then((response) => {
      let recipes = response.data.recipes;
      // res.send({response});
      res.render("receitas", { recipes });
      console.log(recipes)
    })
    .catch((error) => {
      console.log(error)
    })


});

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

//teste api

// router.get("/receitasteste", (req, res) => {
//   // console.log('entrou rota');
//   recipesAPI.getFullList()
//     .then(responseFromApi => {
//       // console.log('entrou');
//       res.send(responseFromApi.data);
//     })
//     .catch(err => {
//       res.send(err);
//     })
 
// });

// router.get('/search', (req, res) => {
//   const search = request.query
//   recipesAPI.getFullList(search.extendedIngredients.name)
//     .then(responseFromApi => {
//       res.send(responseFromApi.data);
//     })
//     .catch(err => {
//       res.send(err);
//     })
  
// })



module.exports = router;