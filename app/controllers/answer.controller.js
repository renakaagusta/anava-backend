// Import Answer model
const db = require("../models");
const Answer = db.answer;
const AnswerForm = db.answerForm;

var multer = require("multer");
var path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname + "./../../../"),
  filename: function (req, file, cb) {
    console.log("id: " + JSON.stringify(req.body));
    if (req.body.eventName == "OSM" && req.body.stageName == "semifinal") {
      cb(null, "answer_" + req.params.id + ".pdf");
    } else if (req.body.eventName == "The One" && req.body.stageName == "semifinal") {
      cb(null, "answer_" + req.params.id + ".jpg");
    } else if (req.body.eventName == "OSM" && req.body.stageName == "final") {
      if (req.body.number == "1" || req.body.number == 1) {
        cb(null, "answer_" + req.params.id + ".pdf");
      } else {
        cb(null, "answer_" + req.params.id + ".ppt");
      }
    } else {
      cb(null, "answer_" + req.params.id + ".png");
    }
  },
});

const upload = multer({
  storage: storage,
}).single("file");

// Handle view actions
exports.indexByQuestion = function (req, res) {
  Answer.find(
    {
      question: req.params.questionId,
    },
    function (err, answers) {
      if (err) return res.send(err);

      return res.json({
        message: "answers Detail Loading...",
        data: answers,
      });
    }
  );
};

// Handle view actions
exports.view = function (req, res) {
  Answer.findById(req.params.id, function (err, answer) {
    if (err) return res.send(err);

    return res.json({
      message: "answers Detail Loading...",
      data: answer,
    });
  });
};

// Handle create actions
exports.create = function (req, res) {
  var answer = new Answer({
    question: req.body.questionId,
    answer_form: req.body.answerFormId,
    choosed_option: req.body.choosedOptionId ? req.body.choosedOptionId : null,
    uploaded: req.body.uploaded ? req.body.uploaded : "",
  }).save((err, answer) => {
    if (err) return res.json(err);

    AnswerForm.update(
      { _id: answer.answer_form },
      {
        $addToSet: {
          answers: answer._id,
        },
      },
      function (err, answerForm) {
        if (err) return res.json(err);

        return res.json({
          message: "answer succesfully created",
          data: answer,
        });
      }
    );
  });
};

// Handle update actions
exports.update = function (req, res) {
  Answer.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        choosed_option: req.body.choosedOptionId
          ? req.body.choosedOptionId
          : "",
        updatedAt: Date.now(),
      },
    }
  )
    .then((answer) => {
      if (answer) {
        return res.json({
          message: "answer updated",
          data: answer,
        });
      } else {
        return res.json({
          message: "answers not found",
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

// Handle update actions
exports.upload = function (req, res) {
  upload(req, res, (err) => {
    if (err) return res.status(500).send(err);
    Answer.findOneAndUpdate(
      { _id: req.params.id },
      {
        uploaded: 1,
      },
      { new: true }
    )
      .then((answer) => {
        if (answer) {
          return res.json({
            message: "answer updated",
            data: answer,
          });
        } else {
          return res.json({
            message: "answers not found",
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
  });
};
