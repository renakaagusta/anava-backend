const mongoose = require("mongoose");

const Announcement = mongoose.model(
  "Announcement",
  new mongoose.Schema({
    author_id: String,
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
