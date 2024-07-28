const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["agriculture", "business", "science", "movie", "wildlife"],
      message: "Value is not supported",
    },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timeStamps: true }
);

module.exports = model("Post", postSchema);
