const mongoose = require("mongoose");

const Stage = mongoose.model(
  "Stage",
  new mongoose.Schema({
    name: String,
    description: String,
    rules: String,
    type: {
      type: String,
      default: 'session',
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    },
    session: {
      type: Number,
      default: 1,
    },
    participants: [
      {
        participant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        session: {
          type: Number,
          default: 1,
        },
      },
    ],
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    answer_forms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AnswerForm",
      },
    ],
    sessions: [
      {
        number: {
          type: Number,
          default: 1,
        },
        started_at: {
          type: Date,
          default: Date.now(),
        },
        finsihed_at: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    started_at: {
      type: Date,
      default: Date.now(),
    },
    finished_at: {
      type: Date,
      default: Date.now(),
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

module.exports = Stage;
