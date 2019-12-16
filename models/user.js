const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  // username: String,
  email: String,
  password: String,
  status:  {
    type: String,
    enum: ['Pending_Confirmation','Active'],
  },
  confirmationCode: String,
  googleID: String,
  givenName: String,
  favoriteRecipe: [{type: Schema.Types.ObjectId, ref: 'RandomRecipe'}] 
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;