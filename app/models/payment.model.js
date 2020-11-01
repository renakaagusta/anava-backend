const mongoose = require("mongoose");

const Payment = mongoose.model(
  "Payment",
  new mongoose.Schema({
    name: String,
    verified_by: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    participant: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
    },
    event: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
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

module.exports = Payment;
