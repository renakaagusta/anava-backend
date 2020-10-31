const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const Stage = db.stage;


db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

require("./app/routes/auth.routes")(app);
require("./app/routes/participant.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/stage.routes")(app);
require("./app/routes/announcement.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("User Role added successfuly")
      });

      new Role({
        name: "participant"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("Participant Role added successfuly")
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("Admin Role added successfuly")
      });
    }
  });

  Stage.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Stage({
        name: "preliminary"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("Preliminary Stage added successfuly")
      });

      new Stage({
        name: "semifinal"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("Semifinal Stage added successfuly")
      });

      new Stage({
        name: "final"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("Final Stage added successfuly")
      });
    }
  });
}
