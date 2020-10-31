const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.stage = require("./stage.model");
db.event = require("./event.model");
db.question = require("./question.model");

db.ROLES = ["user", "participant", "admin"];
db.STAGES = ["preliminary", "semifinal", "final"];

module.exports = db;