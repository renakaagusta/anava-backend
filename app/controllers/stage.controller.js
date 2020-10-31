// Import Stage model
const db = require("../models");
const Stage = db.stage;
const Participant = db.participant

// Handle index actions
exports.index = function (req, res) {
    Stage.find({},
    function (err, stages){
        if (err) {
            return res.json({
                status: "error",
                message: err,
            });
        }
        return res.json({
            status: "success",
            message: "Stage Added Successfully",
            data: stages
        });
    });
};

// Handle view actions
exports.view = function (req, res) {
    Stage.findById(req.params.id, function (err, stage) {
        if (err)
            return res.send(err);

        var participants = []
        
        stage.participants.forEach((participant_id)=> {
            Participant.findById(participant_id, function(err, participant) {
                if (err)
                    return res.status(400).send(err);
                
                participants.push(participant)
            })
        })

        stage.participants = participants;

        return res.json({
            message: "stages Detail Loading...",
            data: stage
        });
    });
};

// Handle update actions
exports.update = function (req, res) {
    Stage.findOneAndUpdate(
        {_id: req.params.id},
        {$set: {
            name: req.body.name,
            description: req.body.description,
            rules: req.body.rules,
            started_at: new Date(req.body.startedAt),
            finished_at: new Date(req.body.finishedAt),
            updatedAt: Date.Now(),
        }})
    .then((stage)=>{
        if(stage) {
            return res.json({
                message: "stage updated",
                data: stage
            });
        } else {
            return res.json({
                message: "stages not found",
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

// Handle add participant actions
exports.add = function(req, res) {
    Stage.findOneAndUpdate({
        _id: req.params.id
    },
    {
        $push: {
            participants: {
                id: req.body.participant_id
            }
        }
    },
    function(err, stage) {
        if(err) throw err

        Participant.findOneAndUpdate({
            _id: req.body.participant_id
        },
        {
            $push: {
                stages: {
                    id: req.params.id
                }
            }
        },
        function(err, participant) {
            if(err) throw err

            return res.json({
                message: "Participant added to stage",
                data: stage
            });
        }
        )
    })
} 

// Handle delete actions
exports.delete = function (req, res) { 
    Stage.remove({
            _id: req.params.id
        }, function (err, stage) {
            if (err)
                return res.send(err);
        return res.json({
            status: "success",
            message: "Stage Deleted!"
        });
    });
};