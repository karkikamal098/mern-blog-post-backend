const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ["agriculture","business","science","movie","wildlife"], message: "Value is not supported"},
  description: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
},{timeStamps: true});

module.exports = model("Post", userSchema);
