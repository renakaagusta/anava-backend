// Import Stage model
const db = require("../models");
const Event = db.event;
const Stage = db.stage;
const Participant = db.user;
const Question = db.question;
const AnswerForm = db.answerForm;

// Handle index actions
exports.index = function (req, res) {
  Stage.find({}, function (err, stages) {
    if (err) {
      return res.json({
        status: "error",
        message: err,
      });
    }
    return res.json({
      status: "success",
      message: "Stage Added Successfully",
      data: stages,
    });
  });
};

// Handle view actions
exports.view = async function (req, res) {
  await Stage.findById(req.params.id, async function (err, stage) {
    if (err) return res.status(400).send(err);
    var participants = [];
    await Promise.all(
      stage.participants.map(async (participant) => {
        try {
          var participant = await Participant.findById(
            participant.participant,
            function (err, stage) {
              if (err) return res.status(400).send(err);
            }
          );
          participants.push(participant);
        } catch (error) {
          console.log("error: " + error);
        }
      })
    );
    stage.participants = [];
    stage.participants =participants;

    var _stage = {
      participants: participants
    }

    var questions = [];
    await Promise.all(
      stage.questions.map(async (question_id) => {
        try {
          var question = await Question.findById(question_id, function (
            err,
            question
          ) {
            if (err) return res.status(400).send(err);
          });
          questions.push(question);
        } catch (error) {
          console.log("error: " + error);
        }
      })
    );
    _stage.questions = questions;
    var answerForms = [];
    await Promise.all(
      stage.answer_forms.map(async (answer_form_id) => {
        try {
          var answerForm = await AnswerForm.findById(answer_form_id, function (
            err,
            answerForm
          ) {
            if (err) return res.status(400).send(err);
          });
          answerForms.push(answerForm);
        } catch (error) {
          console.log("error: " + error);
        }
      })
    );
    _stage.answer_forms = answerForms;
    _stage.event = stage.event;
    _stage._id = stage._id;
    _stage.name = stage.name;
    _stage.description = stage.description;
    _stage.rules = stage.rules;
    _stage.event = stage.event;
    _stage.session = stage.session;
    _stage.type = stage.type;
    _stage.started_at = stage.started_at;
    _stage.finished_at = stage.finished_at;
    
    return res.json({
      message: "event Detail Loading...",
      data: _stage,
    });
  });
};

// Handle update actions
exports.update = function (req, res) {
  Stage.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        rules: req.body.rules,
        started_at: new Date(req.body.startedAt),
        finished_at: new Date(req.body.finishedAt),
        updatedAt: Date.now(),
      },
    }
  )
    .then((stage) => {
      if (stage) {
        return res.json({
          message: "stage updated",
          data: stage,
        });
      } else {
        return res.json({
          message: "stages not found",
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

// Handle add participant actions
exports.add = function (req, res) {
  Stage.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $push: {
        participants: {
          participant: req.body.participantId,
          session: req.body.session ? req.body.session : 1,
        },
      },
    },
    function (err, stage) {
      if (err) throw err;

      const participant = Participant.findById(
        req.body.participantId,
        function (err, participant) {
          if (err) throw err;

          if (participant.participant.events.length == 0) {
            console.log("oopsss")
            /*var event = Event.findOne(
              {
                stages: db.mongoose.Types.ObjectId(req.params.id),
              },
              function (err, _event) {
                if (err) throw err;

                var event = {
                  id: _event._id,
                  name: _event.name,
                  stages: {
                    id: req.params.id,
                    name: stage.name,
                    session: req.body.session ? req.body.session : 1,
                  },
                };

                var participant = Participant.findOne(
                  {
                    _id: req.body.participantId,
                  },
                  function (err, participant) {
                    if (err) throw err;

                    participant.participant.events.push(event);

                    participant.save((err, participant) => {
                      if (err) throw err;

                      return res.json({
                        message: "Participant added to stage",
                        data: stage,
                      });
                    });
                  }
                );
              }
            );*/
          } else {
            
            var event = Event.findOne(
              {
                stages: db.mongoose.Types.ObjectId(req.params.id),
              },
              function (err, event) {
                if (err) throw err;

                var participant = Participant.findById(
                  req.body.participantId,
                  function (err, _participant) {
                    if (err) throw err;

                    var events = _participant.participant.events;
                    var index = 0;
                    var find = 0;
                    _participant.participant.events.forEach((_event) => {
                      if (_event.name == event.name) {
                        find = 1;console.log(event.name)
                        events[index].stages.push({
                          id: req.params.id,
                          name: stage.name,
                          session: req.body.session ? req.body.session : 1,
                        });
                        console.log(events[index])
                      
                      }
                      index++;
                    });console.log(find);
                    

                    if(find==0) {
                      var newEvent = {
                        id: event._id,
                        name: event.name,
                        stages: {
                          id: req.params.id,
                          name: stage.name,
                          session: req.body.session ? req.body.session : 1,
                        },
                      };
                      events.push(newEvent)
                    }

                    _participant.participant.events = events;console.log(_participant.participant.events)

                    _participant.save((err, participant) => {
                      if (err) throw err;console.log(participant)
                      return res.json({
                        message: "participant succesfully added",
                        data: participant,
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
  );
};
