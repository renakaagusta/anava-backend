const db = require("../models");
const AnswerForm = db.answerForm;
const Stage = db.stage;
const Question = db.question;
const Answer = db.answer;

var multer = require("multer");
var path = require("path");

const storage = multer.diskStorage({
  destination: path.join(
    __dirname + "./../../../anava-frontend/public/pakta integritas/"
  ),
  filename: function (req, file, cb) {
    cb(null, req.body.stageId + '_' + req.body.participantId + '.pdf');
  },
});

const upload = multer({
  storage: storage,
}).single("file");

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
exports.create = async function (req, res) {
  upload(req, res, err => {
    if (err) return res.status(400).send(err);

  });

  await AnswerForm({
    stage: req.body.stageId,
    participant: req.body.participantId,
    answers: req.body.answers ? req.body.answers : [],
  }).save(async (err, answerForm) => {
    if (err) return res.json(err);

    await Stage.findById(req.body.stageId, async function (err, stage) {
      if (err) return res.status(400).send(err);

      await Stage.update(
        { _id: req.body.stageId },
        {
          $addToSet: {
            answer_forms: answerForm._id,
          },
        },
        { safe: true, upsert: true },
        async function (err, stage) {
          if (err) return res.status(400).json(err);

          await Question.find(
            {
              stage: req.body.stageId,
            },
            async function (err, questions) {
              if (err) return res.status(400).send(err);

              var currentIndex = questions.length,
                temporaryValue,
                randomIndex;

              // While there remain elements to shuffle...
              while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = questions[currentIndex];
                questions[currentIndex] = questions[randomIndex];
                questions[randomIndex] = temporaryValue;
              }

              var questions_id = [];
              questions.forEach((question) => {
                questions_id.push(question._id.toHexString());
              });

              var answers = [];
              await Promise.all(
                questions.map(async (question) => {
                  await Answer({
                    answer_form: answerForm._id,
                    question: question._id,
                    key: question.key,
                  }).save(function (err, answer) {
                    if (err) res.status(400).json(err);

                    answers.push(answer._id);

                    console.log(
                      "questions: " + JSON.stringify(questions_id.length)
                    );
                    console.log("answers: " + JSON.stringify(answers.length));

                    if (answers.length == questions.length) {
                      answerForm.questions = questions_id;
                      answerForm.answers = answers;
                      answerForm.save(async function (err, answerForm) {
                        console.log("answerform err");
                        console.log(err);
                        if (err) return res.status(400).json(err);

                        return res.json({
                          message: "Answer Form succesfully created",
                          data: answerForm,
                        });
                      });
                    }
                  });
                })
              );
            }
          );
        }
      ).catch((error) => {
        console.log(error);
      });
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
