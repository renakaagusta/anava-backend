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
exports.indexByStage = function (req, res) {
  AnswerForm.find(
    {
      stage: req.params.stageId,
    },
    function (err, answerForms) {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: err,
        });
      }

      answerForms = JSON.parse(JSON.stringify(answerForms));

      var index = 0;

      answerForms.forEach((answerForm) => {
        Participant.findById(answerForm.participant, (err, participant) => {
          if (err) return res.status(500).send(err);

          answerForms[index].participant = participant;

          index++;

          if (answerForms.length == index) {
            return res.json({
              status: "success",
              message: "AnswerForm Added Successfully",
              data: answerForms,
            });
          }
        });
      });
    }
  );
};

// Handle index actions
exports.indexByParticipantAndStage = function (req, res) {
  AnswerForm.find(
    {
      stage: req.params.stageId,
      participant: req.params.participantId,
    },
    function (err, answerForms) {
      console.log(answerForms)
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
    if (err) return res.status(500).send(err);

    Participant.findById(answerForm.participant, (err, participant) => {
      if (err) return res.status(500).send(err);

      answerForm = JSON.parse(JSON.stringify(answerForm));

      answerForm.participant = participant;

      return res.json({
        message: "answerForms Detail Loading...",
        data: answerForm,
      });
    });
  });
};

// Handle create actions
exports.create = async function (req, res) {
  await AnswerForm.find(
    {
      participant: req.body.participantId,
      stage: req.body.stageId,
    },
    async function (err, answerForm) {
      if (err) return res.status(500).send(err);

      if (answerForm.length > -1) {
        await Participant.find(
          {
            _id: req.body.participantId,
          },
          async function (err, participant) {
            if (err) return res.status(500).json(err);

            participant = JSON.parse(JSON.stringify(participant[0]));

            var session = 1;

            var _event = {};
            var _stage = {};

            participant.participant.events.forEach((event) => {
              event.stages.forEach((stage) => {
                if (stage.id == req.body.stageId) {
                  session = stage.session;

                  _event = event;
                  _stage = stage;
                }
              });
            });

            if (_event.name == "OSM" || _event.name == "The One") {
              await AnswerForm({
                stage: req.body.stageId,
                participant: req.body.participantId,
                answers: req.body.answers ? req.body.answers : [],
              }).save(async (err, answerForm) => {
                if (err) return res.status(400).json(err);

                await Stage.findById(
                  req.body.stageId,
                  async function (err, stage) {
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
                            if (err) return res.status(400).send(err);

                            var currentIndex = questions.length,
                              temporaryValue,
                              randomIndex;

                            // While there remain elements to shuffle...
                            while (0 !== currentIndex) {
                              // Pick a remaining element...
                              randomIndex = Math.floor(
                                Math.random() * currentIndex
                              );
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
                                    answerForm.save(async function (
                                      err,
                                      answerForm
                                    ) {
                                      if (err) return res.status(400).json(err);

                                      return res.json({
                                        message:
                                          "Answer Form succesfully created",
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
                  }
                );
              });
            } else if (_event.name == "Started") {
              await AnswerForm({
                stage: req.body.stageId,
                participant: req.body.participantId,
              }).save(async (err, answerForm) => {
                if (err) return res.status(400).json(err);

                await Stage.findById(
                  req.body.stageId,
                  async function (err, stage) {
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

                        var answer = new Answer({
                          answer_form: answerForm._id,
                        });

                        await answer.save(async function (err, _answer) {
                          if (err) res.status(400).json(err);

                          await AnswerForm.findOneAndUpdate(
                            {
                              _id: answerForm._id,
                            },
                            {
                              $addToSet: {
                                answers: answer._id.toString(),
                              },
                            },
                            async function (err, answerForm) {
                              if (err) return res.status(400).json(err);

                              answerForm = JSON.parse(
                                JSON.stringify(answerForm)
                              );
                              answerForm.answers = [];
                              answerForm.answers.push(answer._id);

                              return res.json({
                                message: "Answer Form succesfully created",
                                data: answerForm,
                              });
                            }
                          );
                        });
                      }
                    ).catch((error) => {
                      console.log(error);
                    });
                  }
                );
              });
            }
          }
        );
      } else {
        return res.status(200).send({});
      }
    }
  );
};

// Handle submit actions
exports.submit = async function (req, res) {
  if (req.body.eventName == "OSM" && req.body.stageName == "preliminary") {
    score = 0;
    correct = 0;
    wrong = 0;
    empty = 0;
    AnswerForm.findById(req.body._id, (err, answerForm) => {
      if (err) return res.status(500).send(err);

      var number = 0;

      answerForm.questions.forEach((question) => {
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

          if (number == answerForm.questions.length - 1) {
            score = correct * 4 - wrong;

            answerForm.score = score;
            answerForm.correct = correct;
            answerForm.empty = empty;
            answerForm.wrong = wrong;
            answerForm.updated_at = new Date();

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
  if (req.body.eventName == "The One" && req.body.stageName == "preliminary") {
    score = 0;
    correct = 0;
    wrong = 0;
    empty = 0;
    AnswerForm.findById(req.body._id, (err, answerForm) => {
      if (err) return res.status(500).send(err);

      var number = 0;

      answerForm.questions.forEach((question) => {
        Question.findById(question, (err, question) => {
          if (err) return res.status(500).send(err);

          if (req.body.answers[number] == question.key) {
            correct++;
            score += question.poin;
          } else if (
            req.body.answers[number] == "F" ||
            req.body.answers[number] == null
          ) {
            empty++;
          } else {
            wrong++;
          }

          number++;

          if (number == answerForm.questions.length - 1) {
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

// Handle view actions
exports.setScore = function (req, res) {
  AnswerForm.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      score: req.body.score,
    },
    function (err, answerForm) {
      if (err) return res.send(err);

      return res.json({
        message: "answerForms Detail Loading...",
        data: answerForm,
      });
    }
  );
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
