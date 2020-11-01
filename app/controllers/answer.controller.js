// Import Answer model
const db = require("../models");
const Answer = db.answer;
const AnswerForm = db.answerForm;

// Handle view actions
exports.indexByQuestion = function (req, res) {
    Answer.find({
        question: req.params.questionId
    }, function (err, answers) {
        if (err)
            return res.send(err);

        return res.json({
            message: "answers Detail Loading...",
            data: answers
        })
    });
};

// Handle view actions
exports.view = function (req, res) {
    Answer.findById(req.params.id, function (err, answer) {
        if (err)
            return res.send(err);

        return res.json({
            message: "answers Detail Loading...",
            data: answer
        });
    });
};

// Handle create actions
exports.create = function (req, res) {
    var answer = new Answer({
        question: req.body.questionId,
        answer_form: req.body.answerFormId,
        choosed_option: (req.body.choosedOptionId) ? req.body.choosedOptionId : null,
        uploaded: (req.body.uploaded) ? req.body.uploaded : '',
    }).save((err, answer)=> {
        if(err)
            return res.json(err)

        AnswerForm.update({_id: answer.answer_form},
            {
                $addToSet: {
                    answers: answer._id
                }
            }, 
            function(err, answerForm) {
                if(err)
                    return res.json(err)
                
                return res.json({
                    message: "answer succesfully created",
                    data: answer
                });      
            })
    })
};

// Handle update actions
exports.update = function (req, res) {
    Answer.findOneAndUpdate(
        {_id: req.params.id},
        {$set: {
            choosed_option: (req.body.choosedOptionId) ? req.body.choosedOptionId : '',
            updatedAt: Date.now(),
        }})
    .then((answer)=>{
        if(answer) {
            return res.json({
                message: "answer updated",
                data: answer
            });
        } else {
            return res.json({
                message: "answers not found",
                data: {}
            });
        }
    })
    .catch((err)=>{
        return res.json({
            message: "error",
            data: err
        })
    })
};
