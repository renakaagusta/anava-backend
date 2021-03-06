const mongoose = require("mongoose");

const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    name: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    logo: {
      type: String,
      default: '',
    },
    contact_person: {
      name: {
        type: String,
        default: "",
      },
      phone_number: {
        type: String,
        default: "",
      },
    },
    registration: {
      opened_at: {
        type: Date,
        default: Date.now(),
      },
      closed_at: {
        type: Date,
        default: Date.now(),
      },
    },
    stages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stage",
      },
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
