// Import Announcement model
const db = require("../models");
const Announcement = db.announcement;
const Admin = db.user

// Handle index actions
exports.index = function (req, res) {
    Announcement.find({},
    function (err, announcements){
        if (err) {
            return res.json({
                status: "error",
                message: err,
            });
        }
        return res.json({
            status: "success",
            message: "Announcement Added Successfully",
            data: announcements
        });
    });
};

// Handle view actions
exports.view = function (req, res) {
    Announcement.findById(req.params.id, function (err, announcement) {
        if (err)
            return res.send(err);

        Admin.findById(announcement._id, function(err, admin) {
            if(err)
                return res.status(400).send(err);
            
            announcement.author = admin
            
            return res.json({
                message: "announcements Detail Loading...",
                data: announcement
            });    
        })
    });
};

// Handle create actions
exports.create = function (req, res) {
    var announcement = new Announcement({
        author_id: req.body.admin_id,
        title: req.body.title,
        content: req.body.content,
    }).save((err)=> {
        if(err)
            return res.json(err)
        
        return res.json({
            message: "announcement succesfully created",
            data: announcement
        });    
    })
};

// Handle update actions
exports.update = function (req, res) {
    Announcement.findOneAndUpdate(
        {_id: req.params.id},
        {$set: {
            title: req.body.title,
            content: req.body.content,
            updated_at: Date.now(),
        }})
    .then((announcement)=>{
        if(announcement) {
            return res.json({
                message: "announcement updated",
                data: announcement
            });
        } else {
            return res.json({
                message: "announcements not found",
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
    Announcement.remove({
            _id: req.params.id
        }, function (err, announcement) {
            if (err)
                return res.send(err);
        return res.json({
            status: "success",
            message: "Announcement Deleted!"
        });
    });
};