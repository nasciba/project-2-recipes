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
      sourceUrl: {
        type: String,
        format:"uri"
        },
      spoonacularSourceUrl: {
        type: String,
        format:"uri"
        },
      aggregateLikes: Number,
      spoonacularScore: Number,
      healthScore: Number,
      creditsText: String,
      sourceName: String,
      pricePerServing: Number,
      extendedIngredients : {
        type: Array,
        items:{
          type: Object,
          properties: {
            id: Number,
            aisle: String,
            image: {
              type: String,
              format:"uri"
            },
            name: String,
            amount: Number,
            unit: String,
            unitShort: String,
            unitLong: String,
            originalString: String,
          }
        }
      },
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
      winePairing: {
        type : Object,
        items: {
          type: Array
        }
      },
      instructions: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const RandomRecipe = mongoose.model("RandomRecipe", randomRecipeSchema);

module.exports = RandomRecipe;