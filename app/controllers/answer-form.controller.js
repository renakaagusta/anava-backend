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
  AnswerForm.findOne(
    {
      stage: req.params.stageId,
      participant: req.params.participantId,
    },
    function (err, answerForm) {
      if (err) {
        return res.json({
          status: "error",
          message: err,
        });
      }

      if (answerForm != null) {
        if (answerForm.answers != null) {
          var index = 0;

          answerForm = JSON.parse(JSON.stringify(answerForm));

          answerForm.answers.forEach((answerId) => {
            Answer.findById(answerId, (err, answer) => {
              if (err) return res.status(500).send(err);

              answerForm.answers[index] = answer;
              index++;

              if (index == answerForm.answers.length) {
                return res.json({
                  status: "success",
                  message: "AnswerForm Added Successfully",
                  data: answerForm,
                });
              }
            });
          });
        } else {
          return res.json({
            status: "success",
            message: "AnswerForm Added Successfully",
            data: answerForm,
          });
        }
      }
    }
  );
};

// Handle view actions
exports.view = function (req, res) {
  AnswerForm.findById(req.params.id, function (err, answerForm) {
    if (err) return res.status(500).send(err);
    console.log(answerForm);

    Participant.findById(answerForm.participant, (err, participant) => {
      if (err) return res.status(500).send(err);

      answerForm = JSON.parse(JSON.stringify(answerForm));

      answerForm.participant = participant;

      var index = 0;

      answerForm.answers.forEach((answerId) => {
        Answer.findById(answerId, (err, answer) => {
          if (err) return res.status(500).send(err);

          answerForm.answers[index] = answer;
          index = 0;
          index++;

          if (index == answerForm.answers.length) {
            if (answerForm.stage == "5fcde27a333a4119d266771d") {
              return res.json({
                status: "success",
                message: "AnswerForm Added Successfully",
                data: answerForm,
              });
            } else {
              index = 0;
              answerForm.questions.forEach((questionId) => {
                Question.findById(questionId, (err, question) => {
                  if (err) return res.status(500).send(err);

                  question = JSON.parse(JSON.stringify(question));
                  question.content = null;
                  questions.answers = null;

                  answerForm.questions[index] = question;
                  index++;

                  console.log(index);

                  if (index == answerForm.questions.length - 1) {
                    return res.json({
                      status: "success",
                      message: "AnswerForm Added Successfully",
                      data: answerForm,
                    });
                  }
                });
              });
            }
          }
        });
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

      if (answerForm.length == 0) {
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
                            console.log("ini lhooooo");

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

                                      answerForm = JSON.parse(
                                        JSON.stringify(answerForm)
                                      );

                                      answerForm.money = 20000;

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
    await AnswerForm.findById(req.body._id, async (err, answerForm) => {
      if (err) return res.status(500).send(err);

      var index = 0;
      var answers = [];

      req.body.answers.forEach(() => {
        answers.push(null);
      });

      index = 0;

      req.body.questions.forEach((question) => {
        answers[question.number - 1] = req.body.answers[index];

        console.log("ke: " + (index + 1));
        console.log("nomor soal: " + question.number);
        console.log("jawaban: " + req.body.answers[index]);
        console.log("kunci: " + question.key);
        if (req.body.answers[index] == question.key) {
          correct++;
        } else if (
          req.body.answers[index] == "F" ||
          req.body.answers[index] == null
        ) {
          empty++;
        } else {
          wrong++;
        }

        index++;

        if (index == req.body.answers.length) {
          score = correct * 4 - wrong;

          answerForm.score = score;
          answerForm.correct = correct;
          answerForm.empty = empty;
          answerForm.wrong = wrong;
          answerForm._answers = JSON.stringify(answers);
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
            { new: true },
            function (err, answerForm) {
              if (err) return res.status(500).send(err);

              return res.json({
                data: answerForm,
                message: "Successfully submitted",
              });
            }
          );
        }
      });
    });
  }
  if (req.body.eventName == "The One" && req.body.stageName == "preliminary") {
    score = 0;
    correct = 0;
    wrong = 0;
    empty = 0;
    await AnswerForm.findOne(
      {
        participant: req.body.participant,
        stage: req.body.stage,
      },
      async (err, answerForm) => {
        if (err) return res.status(500).send(err);

        var questions = [];
        var index = 0;
        var answers = [];

        req.body.answers.forEach(() => {
          answers.push(null);
        });

        await Promise.all(
          answerForm.questions.map(async (question) => {
            await Question.findById(question, async (err, question) => {
              if (err) return res.status(500).send(err);
              answers[question.number - 1] = req.body.answers[index];

              index++;
              question = JSON.parse(JSON.stringify(question));
              questions.push(question);

              if (questions.length == req.body.answers.length) {
                index = 0;

                questions.forEach((question) => {
                  console.log(index + "b");

                  console.log("ke: " + (index + 1));
                  console.log("nomor soal: " + question.number);
                  console.log("jawaban: " + req.body.answers[index]);
                  console.log("kunci: " + question.key);
                  if (req.body.answers[index] == question.key) {
                    correct++;
                    score += question.poin;
                  } else if (
                    req.body.answers[index] == "F" ||
                    req.body.answers[index] == null
                  ) {
                    empty++;
                  } else {
                    wrong++;
                  }

                  index++;

                  if (index == req.body.answers.length) {
                    answerForm.score = score;
                    answerForm.correct = correct;
                    answerForm.empty = empty;
                    answerForm.wrong = wrong;
                    answerForm._answers = JSON.stringify(answers);
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
                      { new: true },
                      function (err, answerForm) {
                        if (err) return res.status(500).send(err);

                        return res.json({
                          data: answerForm,
                          message: "Successfully submitted",
                        });
                      }
                    );
                  }
                });
              }
            });
          })
        );
      }
    );
  }
  if (req.body.eventName == "The One" && req.body.stageName == "semifinal") {
    score = 0;
    correct = 0;
    wrong = 0;
    empty = 0;
    await AnswerForm.findOne(
      {
        _id: req.body._id,
      },
      async (err, answerForm) => {
        if (err) return res.status(500).send(err);

        var questions = [];
        var index = 0;
        var answers = [];

        req.body.answers.forEach(() => {
          answers.push(null);
        });

        await Promise.all(
          answerForm.questions.map(async (question) => {
            await Question.findById(question, async (err, question) => {
              if (err) return res.status(500).send(err);
              answers[question.number - 1] = req.body.answers[index];

              index++;
              question = JSON.parse(JSON.stringify(question));
              questions.push(question);

              if (questions.length == req.body.answers.length) {
                index = 0;

                questions.forEach((question) => {
                  console.log(index + "b");

                  console.log("ke: " + (index + 1));
                  console.log("nomor soal: " + question.number);
                  console.log("jawaban: " + req.body.answers[index]);
                  console.log("kunci: " + question.key);
                  if (req.body.answers[index] == question.key) {
                    correct++;
                    score += question.poin;
                  } else if (
                    req.body.answers[index] == "F" ||
                    req.body.answers[index] == null
                  ) {
                    empty++;
                  } else {
                    wrong++;
                  }

                  index++;

                  if (index == req.body.answers.length) {
                    answerForm.score = score;
                    answerForm.correct = correct;
                    answerForm.empty = empty;
                    answerForm.wrong = wrong;
                    answerForm._answers = JSON.stringify(answers);
                    answerForm.money = req.body.money;
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
                      { new: true },
                      function (err, answerForm) {
                        if (err) return res.status(500).send(err);

                        return res.json({
                          data: answerForm,
                          message: "Successfully submitted",
                        });
                      }
                    );
                  }
                });
              }
            });
          })
        );
      }
    );
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
  console.log(req.params);
  AnswerForm.remove(
    {
      participant: req.params.idParticipant,
      stage: req.params.idStage,
    },
    function (err, answerForm) {
      console.log(answerForm);
      if (err) return res.send(err);
      return res.json({
        status: "success",
        message: "AnswerForm Deleted!",
      });
    }
  );
};
