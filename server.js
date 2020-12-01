const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
var logger = require("morgan");

const app = express();

var corsOptions = {
  origin: "http://localhost:8080",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));

const db = require("./app/models");
const Role = db.role;
const Stage = db.stage;
const Event = db.event;
const Mail = db.mail;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

require("./app/routes/auth.routes")(app);
require("./app/routes/participant.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/announcement.routes")(app);
require("./app/routes/answer-form.routes")(app);
require("./app/routes/answer.routes")(app);
require("./app/routes/payment.routes")(app);
require("./app/routes/event.routes")(app);
require("./app/routes/stage.routes")(app);
require("./app/routes/question.routes")(app);
require("./app/routes/mail.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("User Role added successfuly");
      });

      new Role({
        name: "participant",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("Participant Role added successfuly");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("Admin Role added successfuly");
      });
    }
  });

  Mail.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Mail({}).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("Mail added successfuly");
      });
    }
  });

  Event.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      var stages = [];

      new Stage({
        name: "preliminary",
        session: 2,
        participants: [],
      }).save((err, stage) => {
        if (err) {
          console.log("error", err);
        }

        stages.push(stage._id);

        console.log("Preliminary Stage of OSM added successfuly");

        new Stage({
          name: "semifinal",
          participants: [],
        }).save((err, stage) => {
          if (err) {
            console.log("error", err);
          }

          stages.push(stage._id);
          console.log("Semifinal Stage of OSM added successfuly");

          new Stage({
            name: "final",
            participants: [],
          }).save((err, stage) => {
            if (err) {
              console.log("error", err);
            }

            stages.push(stage._id);
            console.log("Final Stage of OSM added successfuly");

            new Event({
              name: "OSM",
              stages: stages,
            }).save((err, event) => {
              if (err) {
                console.log("error", err);
              }

              console.log("OSM added successfuly");

              var stages2 = [];

              new Stage({
                name: "preliminary",
                participants: [],
              }).save((err, stage) => {
                if (err) {
                  console.log("error", err);
                }

                stages2.push(stage._id);
                console.log("Preliminary Stage of Ranking 1 added successfuly");

                new Stage({
                  name: "semifinal",
                  participants: [],
                }).save((err, stage) => {
                  if (err) {
                    console.log("error", err);
                  }

                  stages2.push(stage._id);
                  console.log("Semifinal Stage of Ranking 1 added successfuly");

                  new Stage({
                    name: "final",
                    participants: [],
                  }).save((err, stage) => {
                    if (err) {
                      console.log("error", err);
                    }

                    stages2.push(stage._id);
                    console.log("Final Stage of Ranking 1 added successfuly");

                    new Event({
                      name: "Ranking 1",
                      stages: stages2,
                    }).save((err, event) => {
                      if (err) {
                        console.log("error", err);
                      }

                      console.log("Ranking 1 added successfuly");

                      var stages3 = [];

                      new Stage({
                        name: "preliminary",
                      }).save((err, stage) => {
                        if (err) {
                          console.log("error", err);
                        }

                        stages3.push(stage._id);
                        console.log("Preliminary of Poster added successfuly");

                        new Stage({
                          name: "final",
                        }).save((err, stage) => {
                          if (err) {
                            console.log("error", err);
                          }

                          stages3.push(stage._id);
                          console.log("Final of Poster added successfuly");

                          new Event({
                            name: "Poster",
                            stages: stages,
                            participants: [],
                          }).save((err, event) => {
                            if (err) {
                              console.log("error", err);
                            }

                            console.log("Poster added successfuly");
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    }
  });
}
