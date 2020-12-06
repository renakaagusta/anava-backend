// Import Mail model
const db = require("../models");
const Mail = db.mail;

// Handle index actions
exports.index = function (req, res) {
    Mail.find({},
    function (err, mails){
        if (err) {
            return res.json({
                status: "error",
                message: err,
            });
        }
        return res.json({
            status: "success",
            message: "Mail Added Successfully",
            data: mails[0]
        });
    });
};

// Handle update actions
exports.update = function (req, res) {
    Mail.findOneAndUpdate(
        {},
        {$set: {
            email: req.body.email,
            password: req.body.password,
        }})
    .then((mail)=>{
        if(mail) {
            return res.json({
                message: "mail updated",
                data: mail
            });
        } else {
            return res.json({
                message: "mails not found",
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