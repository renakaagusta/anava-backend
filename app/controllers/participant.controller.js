// Import Participant model
const db = require("../models");
const Participant = db.user;
const Role = db.role;
const Stage = db.stage;

var multer = require("multer");
var path = require("path");

var id = "";

const storage = multer.diskStorage({
  destination: path.join(__dirname + "./../../../"),
  filename: function (req, file, cb) {
    console.log(req.body.type + req.params.id);
    cb(null, req.body.type + "_" + req.params.id + ".jpg");
  },
});

const upload = multer({
  storage: storage,
}).single("file");

// Handle index actions
exports.index = function (req, res) {
  Role.findOne(
    {
      name: "participant",
    },
    function (err, role) {
      Participant.find(
        {
          roles: role._id,
        },
        function (err, participants) {
          if (err) {
            return res.json({
              status: "error",
              message: err,
            });
          }
          return res.json({
            status: "success",
            message: "Participant Added Successfully",
            data: participants,
          });
        }
      );
    }
  );
};

// Handle create actions
exports.new = function (req, res) {
  var participant = new Participant();
  participant.username = req.body.name;
  participant.email = req.body.email;
  participant.password = req.body.password;

  // Save and validate
  participant.save(function (err) {
    if (err) return res.json(err);
    return res.json({
      message: "New Participant Created!",
      data: participant,
    });
  });
};

// Handle view actions
exports.view = function (req, res) {
  Participant.findById(req.params.id, function (err, participant) {
    if (err) return res.send(err);
    return res.json({
      message: "participants Detail Loading...",
      data: participant,
    });
  });
};

// Handle update actions
exports.update = function (req, res) {
  id = req.params.id;
  participant = {};
  if (req.body.username) participant.username = req.body.username;
  if (req.body.email) participant.email = req.body.email;
  if (req.body.password) participant.username = req.body.password;
  if (req.body.password) participant.username = req.body.password;
  if (req.body.firstname) participant.firstname = req.body.firstname;
  if (req.body.lastname) participant.lastname = req.body.lastname;
  if (req.body.birthDate)
    participant["participant.birth_date"] = new Date(req.body.birthDate);
  if (req.body.grade) participant["participant.grade"] = req.body.grade;
  if (req.body.address) participant["participant.address"] = req.body.address;
  if (req.body.phoneNumber)
    participant["participant.phone_number"] = req.body.phoneNumber;
  if (req.body.schoolName)
    participant["participant.school.name"] = req.body.schoolName;
  if (req.body.schoolAddress)
    participant["participant.school.address"] = req.body.schoolAddress;
  if (req.body.region) participant["participant.region"] = req.body.region;
  participant.updated_at = Date.now();
  Participant.findOneAndUpdate(
    { _id: id },
    { $set: participant },
    { new: true },
    (err, participant) => {
      console.log(err);
      console.log(participant);
      console.log(req.body);
      if (err) return res.status(400).send(err);

      return res.json({
        message: "Data berhasil diperbarui",
        data: participant,
      });
    }
  );
};

// Handle verify actions
exports.verify = function (req, res) {
  id = req.params.id;
  Participant.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        "participant.document.image.status": req.body.imageStatus,
        "participant.document.osis_card.status": req.body.osisCardStatus,
        "participant.payment.status": req.body.paymentStatus,
        updated_at: Date.now(),
      },
    }
  )
    .then((participant) => {
      if (participant) {
        return res.json({
          message: "participant updated",
          data: participant,
        });
      } else {
        return res.json({
          message: "participants not found",
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

// Handle upload actions
exports.upload = function (req, res) {
  id = req.params.id;
  upload(req, res, (err) => {
    if (err) return res.status(500).send(err);

    const type = req.body.type;

    if (type == "image_profile") {
      Participant.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            image: "img_" + id,
            updated_at: Date.now(),
          },
        },
        { new: true }
      )
        .then((participant) => {
          if (participant) {
            return res.json({
              message: "participant updated",
              data: participant,
            });
          } else {
            return res.json({
              message: "participants not found",
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
    } else if (type == "image") {
      id = req.params.id;
      Participant.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            "participant.document.image": 1,
            updated_at: Date.now(),
          },
        },
        { new: true }
      )
        .then((participant) => {
          if (participant) {
            return res.json({
              message: "participant updated",
              data: participant,
            });
          } else {
            return res.json({
              message: "participants not found",
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
    } else if (type == "osis_card") {
      id = req.params.id;
      Participant.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            "participant.document.osis_card": 1,
            updated_at: Date.now(),
          },
        },
        { new: true }
      )
        .then((participant) => {
          if (participant) {
            return res.json({
              message: "participant updated",
              data: participant,
            });
          } else {
            return res.json({
              message: "participants not found",
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
    } else if (type == "payment") {
      id = req.params.id;
      Participant.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            "participant.payment.status": 1,
            updated_at: Date.now(),
          },
        },
        { new: true }
      )
        .then((participant) => {
          if (participant) {
            return res.json({
              message: "participant updated",
              data: participant,
            });
          } else {
            return res.json({
              message: "participants not found",
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
    }
  });
};

// Handle delete actions
exports.delete = function (req, res) {
  Participant.remove(
    {
      _id: req.params.id,
    },
    function (err, participant) {
      if (err) return res.send(err);

      Stage.findOneAndUpdate(
        {
          $participants: req.params.id,
        },
        {
          $pull: {
            $participants: req.params.id,
          },
        },
        function (err, stage) {
          if (err) return res.send(err);

          return res.json({
            status: "success",
            message: "Participant Deleted!",
          });
        }
      );
    }
  );
};
