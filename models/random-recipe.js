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
    //extendedIngredients: [ [Object], [Object], [Object], [Object], [Object] ],
    id: Number,
    title: String,
    readyInMinutes: Number,
    servings: Number,
    image: String,
    imageType: String,
    // cuisines: [],
    // dishTypes: [],
    // diets: [
    //   'gluten free',
    //   'dairy free',
    //   'lacto ovo vegetarian',
    //   'fodmap friendly',
    //   'vegan'
    // ],
    // occasions: [],
    // winePairing: {},
    instructions: String
    // analyzedInstructions: [ [Object] ]
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const RandomRecipe = mongoose.model("RandomRecipe", randomRecipeSchema);

module.exports = RandomRecipe;