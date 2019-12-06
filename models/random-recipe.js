const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const randomRecipeSchema = new Schema({
      vegetarian: Boolean,
      vegan: Boolean,
      glutenFree: Boolean,
      dairyFree: Boolean,
      veryHealthy: Boolean,
      cheap: Boolean,
      veryPopular: Boolean,
      sustainable: Boolean,
      weightWatcherSmartPoints: Number,
      gaps: String,
      lowFodmap: Boolean,
      ketogenic: Boolean,
      whole30: Boolean,
      sourceUrl: String,
      spoonacularSourceUrl: String,
      aggregateLikes: Number,
      spoonacularScore: Number,
      healthScore: Number,
      creditsText: String,
      sourceName: String,
      pricePerServing: Number,
      // extendedIngredients : [{    
      //       id: Number,
      //       aisle: String,
      //       image: String,
      //       name: String,
      //       amount: Number,
      //       unit: String,
      //       unitShort: String,
      //       unitLong: String,
      //       originalString: String,
      //       metaInformation:[{
      //       info: String
      //     }]    
      // }],
      id: Number,
      title: String,
      readyInMinutes: Number,
      servings: Number,
      image: String,
      imageType: String,
      cuisines: [{
        type: String,
      }],
      dishTypes: {type:[String]},
      diets: [{
        type: String,
      }],
      occasions: [{
        type: String,
      }],
      winePairing: [{
        type: String,
      }],
      instructions: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const RandomRecipe = mongoose.model("RandomRecipe", randomRecipeSchema);

module.exports = RandomRecipe;