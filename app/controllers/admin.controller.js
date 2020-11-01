// Import Admin model
const db = require("../models");
const Admin = db.user;
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
    Role.find({
        'name': 'admin'
    },
    function(err, role) {
        Admin.find({
            'roles': role._id
        },
        function (err, admins){
            if (err) {
                return res.json({
                    status: "error",
                    message: err,
                });
            }
            return res.json({
                status: "success",
                message: "Admin Added Successfully",
                data: admins
            });
        });
    })
};

// Handle create actions
exports.new = function (req, res) {
    var admin = new Admin();
    admin.username = req.body.name;
    admin.email = req.body.email;
    admin.password = req.body.password;

    // Save and validate
    admin.save(function (err) {
        if (err)
            return res.json(err);
    return res.json({
        message: "New Admin Created!",
        data: admin
        });
    });
};

// Handle view actions
exports.view = function (req, res) {
    Admin.findById(req.params.id, function (err, admin) {
        if (err)
            return res.send(err);
        return res.json({
            message: "admins Detail Loading...",
            data: admin
        });
    });    
};

// Handle update actions
exports.update = function (req, res) {
    id = req.params.id
    Admin.findOneAndUpdate(
        {_id: id},
        {$set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            updated_at: Date.now(),
        }})
    .then((admin)=>{
        if(admin) {
            return res.json({
                message: "admin updated",
                data: admin
            });
        } else {
            return res.json({
                message: "admins not found",
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
    Admin.findOneAndUpdate(
        {_id: id},
        {$set: {
            'admin.document.image.status': req.body.imageStatus,
            'admin.document.osis_card.status': req.body.osisCardStatus,
            'admin.payment.status': req.body.paymentStatus,
            'updated_at': Date.now()
        }})
    .then((admin)=>{
        if(admin) {
            return res.json({
                message: "admin updated",
                data: admin
            });
        } else {
            return res.json({
                message: "admins not found",
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
            Admin.findOneAndUpdate(
                {_id: id},
                {$set: {
                    'image': 'img_'+id,
                    'updated_at': Date.now()
                }})
            .then((admin)=>{
                if(admin) {
                    return res.json({
                        message: "admin updated",
                        data: admin
                    });
                } else {
                    return res.json({
                        message: "admins not found",
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
    Admin.remove({
            _id: req.params.id
        }, function (err, admin) {
            if (err)
                return res.send(err);
        return res.json({
            status: "success",
            message: "Admin Deleted!"
        });
    });
};