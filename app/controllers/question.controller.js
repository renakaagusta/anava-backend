// Import Question model
const db = require("../models");
const Question = db.question;
const Stage = db.stage;

// Handle view actions
exports.view = function (req, res) {
  Question.findById(req.params.id, function (err, question) {
    if (err) return res.send(err);

    return res.json({
      message: "questions Detail Loading...",
      data: question,
    });
  });
};

// Handle create actions
exports.create = function (req, res) {
  var question = new Question({
    stage: req.body.stageId,
    number: req.body.number,
    title: req.body.title ? req.body.title : "",
    content: req.body.content,
    title: req.body.description ? req.body.description : "",
    solution: req.body.solution ? req.body.solution : "",
    key: req.body.key ? req.body.key : "",
    price: req.body.price ? req.body.price : 0,
    time: req.body.time ? req.body.time : 0,
    options: req.body.options ? req.body.options : [],
  }).save((err, question) => {
    if (err) return res.json(err);

    Stage.update(
      { _id: req.body.stageId },
      {
        $addToSet: {
          questions: question._id,
        },
      },
      { safe: true, upsert: true },
      function (err, stage) {
        if (err) return res.json(err);
        
        return res.json({
          message: "question succesfully created",
          data: question,
        });
      }
    ).catch((error) => {
      console.log(error);
    });
  });
};

// Handle update actions
exports.update = function (req, res) {
  Question.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        number: req.body.number,
        title: req.body.title ? req.body.title : "",
        content: req.body.content,
        title: req.body.description ? req.body.description : "",
        solution: req.body.solution ? req.body.solution : "",
        key: req.body.key ? req.body.key : "",
        price: req.body.price ? req.body.price : 0,
        time: req.body.time ? req.body.time : 0,
        options: req.body.options ? req.body.options : [],
        updatedAt: Date.now(),
      },
    }
  )
    .then((question) => {
      if (question) {
        return res.json({
          message: "question updated",
          data: question,
        });
      } else {
        return res.json({
          message: "questions not found",
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

// Handle delete actions
exports.delete = function (req, res) {
    Question.findOne(
    {
      _id: req.params.id,
    },
    function (err, question) {
      if (err) return res.send(err);

      Stage.update(
        {
          questions: req.params.id,
        },
        {
          $pull: {
            questions: req.params.id,
          },
        },
        { safe: true },
        function (err, stage) {
          if (err) return res.send(err);

          return res.json({
            status: "success",
            message: "Question Deleted!",
          });
        }
      );
    }
  );
};
