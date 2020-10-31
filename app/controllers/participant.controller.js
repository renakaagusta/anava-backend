// Import Participant model
const db = require("../models");
const Participant = db.user;
const Role = db.role;

var multer = require('multer');
var path = require('path');

var id = ""

const storage = multer.diskStorage({
    destination : path.join(__dirname + './../../voting-frontend/public/'),
    filename: function(req, file, cb){
        if(path.extname(file.originalname)!='.pdf') {
            cb(null, id + '.jpg');
        } else {
            cb(null, id + '.pdf'); 
        }
    }
});

const upload = multer({
    storage : storage
}).single('file');

// Handle index actions
exports.index = function (req, res) {
    Role.findOne({
        'name': 'participant'
    }, function(err, role){
        Participant.find({
            roles:role._id
        },
            function (err, participants){
                if (err) {
                    return res.json({
                        status: "error",
                        message: err,
                    });
                }
                return res.json({
                    status: "success",
                    message: "Participant Added Successfully",
                    data: participants
                });
        });
    })
};

// Handle create actions
exports.new = function (req, res) {
    var participant = new Participant();
    participant.username = req.body.name;
    participant.email = req.body.email;
    participant.password = req.body.password;

    // Save and validate
    participant.save(function (err) {
        if (err)
            return res.json(err);
    return res.json({
        message: "New Participant Created!",
        data: participant
        });
    });
};

// Handle view actions
exports.view = function (req, res) {
    Participant.findById(req.params.id, function (err, participant) {
        if (err)
            return res.send(err);
        return res.json({
            message: "participants Detail Loading...",
            data: participant
        });
    });
};

// Handle update actions
exports.update = function (req, res) {
    id = req.params.id
    Participant.findOneAndUpdate(
        {_id: id},
        {$set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            updatedAt: Date.Now(),
        }})
    .then((participant)=>{
        if(participant) {
            return res.json({
                message: "participant updated",
                data: participant
            });
        } else {
            return res.json({
                message: "participants not found",
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

// Handle verify actions
exports.verify = function (req, res) {
    id = req.params.id
    Participant.findOneAndUpdate(
        {_id: id},
        {$set: {
            'participant.document.image.status': req.body.imageStatus,
            'participant.document.osis_card.status': req.body.osisCardStatus,
            'participant.payment.status': req.body.paymentStatus,
            'updated_at': Date.now()
        }})
    .then((participant)=>{
        if(participant) {
            return res.json({
                message: "participant updated",
                data: participant
            });
        } else {
            return res.json({
                message: "participants not found",
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

// Handle upload actions
exports.upload = function (req, res) {
    id = req.params.id
    upload(req, res, err => {
        if(err) throw err;

        if(type == 'image_profile') {
            Participant.findOneAndUpdate(
                {_id: id},
                {$set: {
                    'image': 'img_'+id,
                    'updated_at': Date.now()
                }})
            .then((participant)=>{
                if(participant) {
                    return res.json({
                        message: "participant updated",
                        data: participant
                    });
                } else {
                    return res.json({
                        message: "participants not found",
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
        } else if(type == 'image') {
            id = req.params.id
            Participant.findOneAndUpdate(
                {_id: id},
                {$set: {
                    'participant.document.image.status': 1,
                    'updated_at': Date.now()
                }})
            .then((participant)=>{
                if(participant) {
                    return res.json({
                        message: "participant updated",
                        data: participant
                    });
                } else {
                    return res.json({
                        message: "participants not found",
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
        } else if(type == 'osis_card') {
            id = req.params.id
            Participant.findOneAndUpdate(
                {_id: id},
                {$set: {
                    'participant.document.osis_card.status': 1,
                    'updated_at': Date.now()
                }})
            .then((participant)=>{
                if(participant) {
                    return res.json({
                        message: "participant updated",
                        data: participant
                    });
                } else {
                    return res.json({
                        message: "participants not found",
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
        } else if(type == 'payment') {
            id = req.params.id
            Participant.findOneAndUpdate(
                {_id: id},
                {$set: {
                    'participant.payment.status': 1,
                    'updated_at': Date.now()
                }})
            .then((participant)=>{
                if(participant) {
                    return res.json({
                        message: "participant updated",
                        data: participant
                    });
                } else {
                    return res.json({
                        message: "participants not found",
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
        }
    })
}

// Handle delete actions
exports.delete = function (req, res) { 
    Participant.remove({
            _id: req.params.id
        }, function (err, participant) {
            if (err)
                return res.send(err);
        return res.json({
            status: "success",
            message: "Participant Deleted!"
        });
    });
};