const db = require("../models");
const AnswerForm = db.answerForm;
const Stage = db.stage;

// Handle index actions
exports.indexByParticipantAndStage = function (req, res) {
  AnswerForm.find(
    {
      stage: req.params.stageId,
      participant: req.params.participantId,
    },
    function (err, answerForms) {
      if (err) {
        return res.json({
          status: "error",
          message: err,
        });
      }
      return res.json({
        status: "success",
        message: "AnswerForm Added Successfully",
        data: answerForms,
      });
    }
  );
};

// Handle view actions
exports.view = function (req, res) {
  AnswerForm.findById(req.params.id, function (err, answerForm) {
    if (err) return res.send(err);

    return res.json({
      message: "answerForms Detail Loading...",
      data: answerForm,
    });
  });
};

// Handle create actions
exports.create = function (req, res) {
  var answerForm = new AnswerForm({
    stage: req.body.stageId,
    participant: req.body.participantId,
    answers: req.body.answers ? req.body.answers : [],
  }).save((err, answerForm) => {
    if (err) return res.json(err);

    console.log(JSON.stringify(answerForm));

    Stage.update(
      { _id: req.body.stageId },
      {
        $addToSet: {
          answer_forms: answerForm._id,
        },
      },
      { safe: true, upsert: true },
      function (err, stage) {
        if (err) return res.json(err);

        return res.json({
          message: "Answer Form succesfully created",
          data: answerForm,
        });
      }
    ).catch((error) => {
      console.log(error);
    });
  });
};

// Handle delete actions
exports.delete = function (req, res) {
  AnswerForm.remove(
    {
      _id: req.params.id,
    },
    function (err, answerForm) {
      if (err) return res.send(err);
      return res.json({
        status: "success",
        message: "AnswerForm Deleted!",
      });
    }
  );
};
