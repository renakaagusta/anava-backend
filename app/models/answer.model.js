const mongoose = require("mongoose");

const Answer = mongoose.model(
  "Answer",
  new mongoose.Schema({
    question: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    answer_form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnswerForm"
    },
    choosed_option: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chooosedOption"
    },
    uploaded: {
      type: Number,
      default: 0,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    updated_at: {
      type: Date,
      default: Date.now(),
    },
  })
);

module.exports = Answer;
