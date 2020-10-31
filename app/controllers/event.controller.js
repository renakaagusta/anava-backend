// Import Event model
const db = require("../models");
const Event = db.event;
const Stage = db.stage;
const Participant = db.participant

// Handle index actions
exports.index = function (req, res) {
    Event.find({},
    function (err, events){
        if(err) throw err

        if (err) {
            return res.json({
                status: "error",
                message: err,
            });
        }
        return res.json({
            status: "success",
            message: "Event Added Successfully",
            data: events
        });
    });
};

// Handle view actions
exports.view = function (req, res) {
    Event.findById(req.params.id, function (err, event) {
        if (err)
            return res.status(400).send(err);

        var stages = []

        event.stages.forEach((stage_id)=>{
            Stage.findById(stage_id, function (err, stage) {
                if(err)
                    return res.status(400).send(err);

                stages.push(stage)
            })
        })

        event.stages = stages;

        return res.json({
            message: "event Detail Loading...",
            data: event
        });
    });
};

// Handle update actions
exports.update = function (req, res) {
    Event.findOneAndUpdate(
        {_id: req.params.id},
        {$set: {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            'registration.opened_at': new Date(req.body.registrationOpenedAt),
            'registration.closed_at': new Date(req.body.registrationClosedAt),
            updatedAt: Date.Now(),
        }})
    .then((event)=>{
        if(event) {
            return res.json({
                message: "event updated",
                data: event
            });
        } else {
            return res.json({
                message: "events not found",
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

// Handle delete actions
exports.delete = function (req, res) { 
    Event.remove({
            _id: req.params.id
        }, function (err, event) {
            if (err)
                return res.send(err);
        return res.json({
            status: "success",
            message: "Event Deleted!"
        });
    });
};