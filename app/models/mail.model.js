const mongoose = require("mongoose");

const Mail = mongoose.model(
  "Mail",
  new mongoose.Schema({
    email: {
      type: String,
      default: "renakaagusta28@gmail.com",
    },
    password: {
      type: String,
      default: "@Renaka28"
    }
  })
);

module.exports = Mail;
