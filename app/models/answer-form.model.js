const mongoose = require("mongoose");

const AnswerForm = mongoose.model(
  "AnswerForm",
  new mongoose.Schema({
    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage",
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
    poin: {
      type: Number,
      default: 0,
    },
    score: {
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

module.exports = AnswerForm;
