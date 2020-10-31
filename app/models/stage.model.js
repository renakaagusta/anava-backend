const mongoose = require("mongoose");

const Stage = mongoose.model(
  "Stage",
  new mongoose.Schema({
    name: String,
        description: String,
        rules: String,
        participants: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Participant",
          },
        ],
        started_at: {
          type: Date,
          default: Date.now(),
        },
        finsihed_at: {
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
