// Import Stage model
const db = require("../models");
const Stage = db.stage;
const Participant = db.user;
const Question = db.question;
const AnswerForm = db.answerForm

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
      stage.participants.map(async (participant_id) => {
        try {
          var participant = await Participant.findById(
            participant_id,
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
    stage.participants = participants;
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
    stage.questions = questions;
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
    stage.answer_forms = answerForms;
    return res.json({
      message: "event Detail Loading...",
      data: stage,
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
        participants: req.body.participantId,
      },
    },
    function (err, stage) {
      if (err) throw err;

      Participant.findOneAndUpdate(
        {
          _id: req.body.participantId,
        },
        {
          $push: {
            stages: {
              id: req.params.id,
            },
          },
        },
        function (err, participant) {
          if (err) throw err;

          return res.json({
            message: "Participant added to stage",
            data: stage,
          });
        }
      );
    }
  );
};
