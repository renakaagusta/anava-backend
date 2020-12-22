const db = require("../models");
const AnswerForm = db.answerForm;
const Participant = db.user;
const Stage = db.stage;
const Question = db.question;
const Answer = db.answer;

var multer = require("multer");
var path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname + "./../../../"),
  filename: function (req, file, cb) {
    cb(null, req.body.stageId + "_" + req.body.participantId + ".pdf");
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
  await Participant.find(
    {
      _id: req.body.participantId,
    },
    async function (err, participant) {
      if (err) return res.status(500).json(err);

      participant = JSON.parse(JSON.stringify(participant[0]));

      var session = 1;

      participant.participant.events.forEach((event) => {
        if (event.stages.includes(req.body.stageId)) {
          event.stages.forEach((stage) => {
            if (stage.id == req.body.stageId) {
              session = stage.session;
            }
          });
        }
      });

      await AnswerForm({
        stage: req.body.stageId,
        participant: req.body.participantId,
        answers: req.body.answers ? req.body.answers : [],
      }).save(async (err, answerForm) => {
        if (err) return res.status(400).json(err);

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
                  session: session,
                },
                async function (err, questions) {
                  console.log("question");
                  console.log(err);
                  console.log(session);
                  console.log(req.body.stageId);
                  console.log(questions);
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

                        if (answers.length == questions.length) {
                          answerForm.questions = questions;
                          answerForm.answers = answers;
                          answerForm.save(async function (err, answerForm) {
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
    }
  );
};

// Handle submit actions
exports.submit = async function (req, res) {
  console.log(req.body);
  if (req.body.eventName == "OSM" && req.body.stageName == "preliminary") {
    score = 0;
    correct = 0;
    wrong = 0;
    empty = 0;
    AnswerForm.findById(req.body._id, (err, answerForm) => {
      if (err) return res.status(500).send(err);
      console.log("answer-form");

      var number = 0;

      answerForm.questions.forEach((question) => {
        console.log("question");

        Question.findById(question, (err, question) => {
          if (err) return res.status(500).send(err);

          if (req.body.answers[number] == question.key) {
            correct++;
          } else if (
            req.body.answers[number] == "F" ||
            req.body.answers[number] == null
          ) {
            empty++;
          } else {
            wrong++;
          }

          number++;

          console.log("number: " + number);
          console.log("questions length: " + answerForm.questions.length);

          if (number == answerForm.questions.length - 1) {
            score = correct * 4 - wrong;

            answerForm.score = score;
            answerForm.correct = correct;
            answerForm.empty = empty;
            answerForm.wrong = wrong;

            console.log("score: " + answerForm.score);
            console.log("correct: " + answerForm.correct);
            console.log("empty: " + answerForm.empty);
            console.log("wrong: " + answerForm.wrong);

            AnswerForm.findOneAndUpdate(
              {
                _id: answerForm._id,
              },
              answerForm,
              function (err, answerForm) {
                if (err) return res.status(500).send(err);

                return res.json({
                  message: "Successfully submitted",
                });
              }
            );
          }
        });
      });
    });
  }
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
