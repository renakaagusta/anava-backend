// Import Event model
const db = require("../models");
const Event = db.event;
const Stage = db.stage;
const Participant = db.participant;

// Handle index actions
exports.index = async function (req, res) {
  await Event.find({}, async function (err, events) {
    if (err) {
      return res.json({
        status: "error",
        message: err,
      });
    }

    var index = 0;

    await Promise.all(
      events.map(async (event) => {
        var _event = await Event.findById(event.id, async function (
          err,
          event
        ) {
          if (err) return res.status(400).send(err);
          var stages = [];
          await Promise.all(
            event.stages.map(async (stage_id) => {
              var stage = await Stage.findById(stage_id);

              stages.push(stage);
              return stage_id;
            })
          );
          event.stages = stages;
          events[index] = event;
          index++;
        });
      })
    )
      .then(function (results) {
        return res.json({
          status: "success",
          message: "Event Added Successfully",
          data: events,
        });
      })
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
          message: "event updated",
          data: event,
        });
      } else {
        return res.json({
          message: "events not found",
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
