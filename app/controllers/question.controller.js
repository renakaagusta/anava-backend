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

// Handle index actions
exports.indexByStage = function (req, res) {
  Question.find(
    {
      stage: req.params.stageId,
    },
    function (err, questions) {
      if (err) {
        return res.json({
          status: "error",
          message: err,
        });
      }

      return res.json({
        status: "success",
        message: "Question Added Successfully",
        data: questions,
      });
    }
  );
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
    session: req.body.session ? req.body.session : 1,
    options: req.body.options ? req.body.options : [],
  }).save((err, question) => {
    if (err) return res.json(err);

    //OSM Penyisihan & Ranking 1 Babak Gugur
    if(req.body.options) {
      switch(question.key) {
        case 'A':
          question.key = question.options[0]._id;
        break;
        case 'B':
          question.key = question.options[1]._id;
        break;
        case 'C':
          question.key = question.options[2]._id;
        break;
        case 'D':
          question.key = question.options[3]._id;
        break;
        case 'E':
          question.key = question.options[4]._id;
        break;
      }
    }

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
        session: req.body.session ? req.body.session : 1,
        options: req.body.options ? req.body.options : [],
        updatedAt: Date.now(),
      },
    }
  )
    .then((question) => {
      console.log(JSON.stringify(question))
      console.log(req.body.content)
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
