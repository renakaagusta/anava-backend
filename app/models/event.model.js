const mongoose = require("mongoose");

const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    name: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    registration: {
      opened_at: {
        type: Date,
        default: Date.now()
      },
      closed_at: {
        type: Date,
        default: Date.now()
      }
    },
    stages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stage"
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

module.exports = Event;