// Import Event model
const db = require("../models");
const Event = db.event;
const Stage = db.stage;
const Participant = db.user;

var multer = require("multer");
var path = require("path");

var id = "";

const storage = multer.diskStorage({
  destination: path.join(__dirname + "./../../../"),
  filename: function (req, file, cb) {
    console.log(req.body)
    cb(null, "event_document_" + req.params.id + req.params.idParticipant + ".pdf");
  },
});

const upload = multer({
  storage: storage,
}).single("file");

// Handle index actions
exports.index = async function (req, res) {
  var n = 0;
  await Event.find({})
    .sort({ _id: 1 })
    .exec(async function (err, events) {
      if (err) {
        return res.json({
          status: "error",
          message: err,
        });
      }

      var index = 0;

      await Promise.all(
        events.map(async (event) => {
          var _event = await Event.findById(
            event.id,
            async function (err, event) {
              if (err) return res.status(400).send(err);
              var stages = [];
              await Promise.all(
                event.stages.map(async (stage_id) => {
                  var stage = await Stage.findById(stage_id);

                  stages.push(stage);
                  n++;
                  if (n == 10) {
                    event.stages = stages;
                    events[index] = event;
                    return res.json({
                      status: "success",
                      message: "Event Added Successfully",
                      data: events,
                    });
                  }
                })
              );
              event.stages = stages;
              events[index] = event;
              index++;
            }
          );
        })
      )
        .then(function (results) {})
        .catch(function (err) {
          console.log("Catch: ", err);
        });
    });
};

// Handle view actions
exports.view = async function (req, res) {
  await Event.findById(req.params.id, async function (err, event) {
    if (err) return res.status(400).send(err);
    var stages = [];
    await Promise.all(
      event.stages.map(async (stage_id) => {
        try {
          var stage = await Stage.findById(stage_id, function (err, stage) {
            if (err) return res.status(400).send(err);
          });
          stages.push(stage);
        } catch (error) {
          console.log("error: " + error);
        }
      })
    );
    event.stages = stages;
    return res.json({
      message: "event Detail Loading...",
      data: event,
    });
  });
};

// Handle update actions
exports.update = function (req, res) {
  Event.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        "registration.opened_at": new Date(req.body.registrationOpenedAt),
        "registration.closed_at": new Date(req.body.registrationClosedAt),
        updatedAt: Date.now(),
      },
    }
  )
    .then((event) => {
      if (event) {
        return res.json({
          message: "event berhasil diperbarui",
          data: event,
        });
      } else {
        return res.status(400).json({
          message: "event tidak ditemukan",
          data: {},
        });
      }
    })
    .catch((err) => {
      return res.json({
        message: "error",
        data: err,
      });
    });
};

// Handle upload actions
exports.upload = function (req, res) {
  var id = req.params.id;
  upload(req, res, (err) => {
    if (err) return res.status(500).send(err);

    Participant.findOne({ _id: req.body.participantId }, (err, participant) => {
      if (err) return res.status(500).send(err);

      var index = 0;

      participant.participant.events.forEach((event) => {
        if (event.id == id) {
          participant.participant.events[index].document = 1;
        }

        index++;
      });

      participant.save((err, participant) => {
        if (err) return res.status(500).send(err);

        return res.json({
          message: "participant updated",
          data: participant,
        });
      });
    });
  });
};

// Handle add participant actions
exports.add = async function (req, res) {
  await Event.findById(req.params.id, async function (err, event) {
    if (err) res.status(400).json(err);

    await Stage.findOne(
      {
        _id: event.stages[0],
      },
      async function (err, stage) {
        if (err) res.status(500).send(err);

        var included = false;

        stage.participants.forEach((participant) => {
          if (participant.participant == req.body.participantId) {
            included = true;
          }
        });

        if (included) {
          return res.json({
            message: "Participant telah terdaftar sebelumnya",
          });
        } else {
          var _stage = await Stage.findOneAndUpdate(
            {
              _id: event.stages[0],
            },
            {
              $push: {
                participants: {
                  participant: req.body.participantId,
                  session: req.body.session ? req.body.session : 1,
                },
              },
            },
            { upsert: true, new: true }
          );

          var _event = event;

          await Participant.findById(
            req.body.participantId,
            async function (err, participant) {
              if (err) return res.status(400).send(err);

              if (participant.participant.events.length == 0) {
                var event = {
                  id: _event._id,
                  name: _event.name,
                  stages: {
                    id: _event.stages[0],
                    name: stage.name,
                    session: req.body.session ? req.body.session : 1,
                  },
                };

                participant.participant.events.push(event);

                participant.save((err, participant) => {
                  if (err) return res.status(500).send(err);

                  return res.json({
                    message: "Participant added to stage",
                    data: participant,
                  });
                });
              } else {
                var event = Event.findOne(
                  {
                    stages: db.mongoose.Types.ObjectId(req.params.id),
                  },
                  function (err, event) {
                    if (err) return res.status(500).send(err);

                    var participant = Participant.findById(
                      req.body.participantId,
                      function (err, _participant) {
                        if (err) throw err;

                        var events = _participant.participant.events;
                        var index = 0;
                        var find = 0;
                        _participant.participant.events.forEach((__event) => {
                          if (__event.id == _event._id) {
                            find = 1;
                            events[index].stages.push({
                              id: _event.stages[0],
                              name: stage.name,
                              session: req.body.session ? req.body.session : 1,
                            });
                          }
                          index++;
                        });

                        if (find == 0) {
                          var newEvent = {
                            id: _event._id,
                            name: _event.name,
                            stages: {
                              id: _event.stages[0],
                              name: stage.name,
                              session: req.body.session ? req.body.session : 1,
                            },
                          };
                          events.push(newEvent);
                        }

                        _participant.participant.events = events;

                        _participant.save((err, participant) => {
                          if (err) return res.status(400).send(err);

                          console.log(_participant);

                          console.log(participant);

                          return res.json({
                            message: "participant succesfully added",
                            data: _participant,
                          });
                        });
                      }
                    );
                  }
                );
              }
            }
          );
        }
      }
    );
  });
};
