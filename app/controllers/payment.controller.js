// Import Payment model
const db = require("../models");
const Payment = db.payment;
const Participant = db.user;

// Handle index actions
exports.index = function (req, res) {
    Payment.find({},
        function(err, payments) {
            if (err)
                return res.send(err)
            
            return res.json({
                status: "success",
                message: "Payment Added Successfully",
                data: payments
            });
        })
};

// Handle index actions
exports.indexByParticipant = function (req, res) {
    Payment.find({
        participant: req.params.participantId
    },
    function(err, payments) {
        if (err)
            return res.send(err)
        
        return res.json({
            status: "success",
            message: "Payment Added Successfully",
            data: payments
        });
    })
};

// Handle create actions
exports.create = function (req, res) {
    var payment = new Payment();
    payment.participant = req.body.participantId;
    payment.verified_by = req.body.adminId;
    payment.event = req.body.eventId;

    // Save and validate
    payment.save(function (err) {
        if (err)
            return res.json(err);
    return res.json({
        message: "New Payment Created!",
        data: payment
        });
    });
};

// Handle view actions
exports.view = function (req, res) {
    Payment.findById(req.params.id, function (err, payment) {
        if (err)
            return res.send(err);
        return res.json({
            message: "payments Detail Loading...",
            data: payment
        });
    });
};

// Handle delete actions
exports.delete = function (req, res) { 
    Payment.remove({
            _id: req.params.id
        }, function (err, payment) {
            if (err)
                return res.send(err);

            return res.json({
                status: "success",
                message: "Payment Deleted!"
            });
    });
};