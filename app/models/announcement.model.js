const mongoose = require("mongoose");

const Announcement = mongoose.model(
  "Announcement",
  new mongoose.Schema({
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    },
    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage"
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant"
    },
    title: String,
    content: String,
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

module.exports = Announcement;
