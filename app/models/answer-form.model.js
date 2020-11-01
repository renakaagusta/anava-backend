const mongoose = require("mongoose");

const AnswerForm = mongoose.model(
  "AnswerForm",
  new mongoose.Schema({
    stage: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage",
    },
    participant: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
    },
    answers:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer"
      }
    ],
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
