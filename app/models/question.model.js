const mongoose = require("mongoose");

const Question = mongoose.model(
  "Question",
  new mongoose.Schema({
    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage"
    },
    title: String,
    content: String,
    solution: String,
    key: String,
    price: Number,
    option: [
      { 
        letter: String,
        content: String,
      }
    ],
    created_at: {
      type: Date,
      default: Date.now()
    },
    updated_at: {
      type: Date,
      default: Date.now()
    },
  })
);

module.exports = Question;
