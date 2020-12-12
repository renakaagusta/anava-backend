const mongoose = require("mongoose");

const Question = mongoose.model(
  "Question",
  new mongoose.Schema({
    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage"
    },
    number: Number,
    title: String,
    content: String,
    description: String,
    solution: String,
    key: String,
    price: Number,
    time: Number,
    session: {
      type: Number,
      default: 1,
    },
    options: [
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
