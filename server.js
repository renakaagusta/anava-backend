const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
var logger = require("morgan");

const app = express();

//cors
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
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
      new Mail({
        email: 'anava.mipa.ugm@gmail.com',
        password: 'bersatu1'
      }).save((err) => {
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
              price: 35000,
              "contact_person.name": "Nur Indah Setyaningsih",
              "contact_person.phone_number": "082137793955",
              logo: 'osm.png'
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
                console.log("Preliminary Stage of The One added successfuly");

                new Stage({
                  name: "semifinal",
                  participants: [],
                }).save((err, stage) => {
                  if (err) {
                    console.log("error", err);
                  }

                  stages2.push(stage._id);
                  console.log("Semifinal Stage of The One added successfuly");

                  new Stage({
                    name: "final",
                    participants: [],
                  }).save((err, stage) => {
                    if (err) {
                      console.log("error", err);
                    }

                    stages2.push(stage._id);
                    console.log("Final Stage of The One added successfuly");

                    new Event({
                      name: "The One",
                      stages: stages2,
                      "contact_person.name": "Ratna Tri Ningsih",
                      "contact_person.phone_number": "085865645692",
                      price: 45000,
                      logo: 'the-one.png'

                    }).save((err, event) => {
                      if (err) {
                        console.log("error", err);
                      }

                      console.log("The One added successfuly");

                      var stages3 = [];

                      new Stage({
                        name: "preliminary",
                      }).save((err, stage) => {
                        if (err) {
                          console.log("error", err);
                        }

                        stages3.push(stage._id);
                        console.log("Preliminary of Started added successfuly");

                        new Stage({
                          name: "final",
                        }).save((err, stage) => {
                          if (err) {
                            console.log("error", err);
                          }

                          stages3.push(stage._id);
                          console.log("Final of Started added successfuly");

                          new Event({
                            name: "Started",
                            stages: stages3,
                            participants: [],
                            "contact_person.name": "Tara Dwipa A. T.",
                            "contact_person.phone_number": "085869502968",
                            price: 35000,
                            logo: 'started.png'
                          }).save((err, event) => {
                            if (err) {
                              console.log("error", err);
                            }

                            console.log("Started added successfuly");

                            var stages4 = [];

                            new Stage({
                              name: "preliminary",
                            }).save((err, stage) => {
                              if (err) {
                                console.log("error", err);
                              }

                              stages4.push(stage._id);
                              console.log(
                                "preliminary of Sigma added successfuly"
                              );

                              new Event({
                                name: "Sigma",
                                stages: stages4,
                                participants: [],
                                "contact_person.name": "Nisa Dwi Damayanti",
                                "contact_person.phone_number": "081391074047",
                                price: 5000,
                                logo: 'sigma.png'
                              }).save((err, event) => {
                                if (err) {
                                  console.log("error", err);
                                }

                                var stages5 = [];

                                console.log("Sigma added successfuly");

                                new Stage({
                                  name: "preliminary",
                                }).save((err, stage) => {
                                  if (err) {
                                    console.log("error", err);
                                  }

                                  stages5.push(stage._id);
                                  console.log(
                                    "preliminary of Open House added successfuly"
                                  );

                                  new Event({
                                    name: "Open House",
                                    stages: stages5,
                                    participants: [],
                                    "contact_person.name": "Cicilia Debbie S.",
                                    "contact_person.phone_number":
                                      "081351366118",
                                    price: 0,
                                    logo: 'open-house.png'
                                  }).save((err, event) => {
                                    if (err) {
                                      console.log("error", err);
                                    }

                                    console.log("Open House added successfuly");
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
            });
          });
        });
      });
    }
  });
}
