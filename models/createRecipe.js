const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const createRecipeSchema = new Schema({
    title: "String",
    readyInMinutes: Number,
    ingredients: Array,
    directions: String
})

const createRecipe = mongoose.model("createRecipe", createRecipeSchema);
module.exports = createRecipe;