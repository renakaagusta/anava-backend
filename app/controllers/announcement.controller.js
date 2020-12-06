// Import Announcement model
const db = require("../models");
const Announcement = db.announcement;
const Admin = db.user;
const Participant = db.user;
const Stage = db.stage;

// Handle index actions
exports.index = function (req, res) {
  Announcement.find({}, function (err, announcements) {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: err,
      });
    }

    var index = 0;

    announcements.forEach((announcement) => {
      if (announcement.participant != null) {
        Participant.findById(announcement.participant, (err, participant) => {
          if (err) return res.status(500).send(err);

          announcements[index].participant = participant;
          index++;

          if (index == announcements.length)
            return res.json({
              status: "success",
              message: "Announcement Added Successfully",
              data: announcements,
            });
        });
      } else if (announcement.stage != null) {
        Stage.findById(announcement.stage, (err, stage) => {
          if (err) return res.status(500).send(err);

          announcements[index].stage = stage;
          index++;

          if (index == announcements.length)
            return res.json({
              status: "success",
              message: "Announcement Added Successfully",
              data: announcements,
            });
        });
      } else {
        index++;

        if (index == announcements.length)
          return res.json({
            status: "success",
            message: "Announcement Added Successfully",
            data: announcements,
          });
      }
    });
  });
};

// Handle index actions
exports.indexGeneral = function (req, res) {
  Announcement.find(
    {
      stage: null,
      participant: null,
    },
    function (err, announcements) {
      if (err) {
        return res.json({
          status: "error",
          message: err,
        });
      }
      return res.json({
        status: "success",
        message: "Announcement Added Successfully",
        data: announcements,
      });
    }
  );
};

// Handle view actions
exports.indexByStage = function (req, res) {
  Announcement.findById(
    {
      stage: req.params.stageId,
    },
    function (err, announcement) {
      if (err) return res.send(err);

      Admin.findById(announcement.admin, function (err, admin) {
        if (err) return res.status(400).send(err);

        announcement.admin = admin;

        return res.json({
          message: "announcements Detail Loading...",
          data: announcement,
        });
      });
    }
  );
};

// Handle view actions
exports.indexByParticipant = function (req, res) {
  Announcement.findById(
    {
      participant: req.params.participantId,
    },
    function (err, announcement) {
      if (err) return res.send(err);

      Admin.findById(announcement.admin, function (err, admin) {
        if (err) return res.status(400).send(err);

        announcement.admin = admin;

        return res.json({
          message: "announcements Detail Loading...",
          data: announcement,
        });
      });
    }
  );
};

// Handle view actions
exports.view = function (req, res) {
  Announcement.findById(req.params.id, function (err, announcement) {
    if (err) return res.send(err);

    if (announcement.participant) {
      Participant.findById(
        announcement.participant,
        function (err, participant) {
          if (err) return res.status(400).send(err);

          announcement.participant = participant;

          return res.json({
            message: "announcements Detail Loading...",
            data: announcement,
          });
        }
      );
    } else if (announcement.stage) {
      Stage.findById(announcement.stage, function (err, stage) {
        if (err) return res.status(400).send(err);

        announcement.stage = stage;

        return res.json({
          message: "announcements Detail Loading...",
          data: announcement,
        });
      });
    } else {
      return res.json({
        message: "announcements Detail Loading...",
        data: announcement,
      });
    }
  });
};

// Handle create actions
exports.create = function (req, res) {
  const announcementData = {
    admin: req.body.adminId,
    title: req.body.name,
    content: req.body.description,
    participant: req.body.participantId ? req.body.participantId : null,
    stage: req.body.stageId ? req.body.stageId : null,
  };
  var announcement = new Announcement(announcementData).save((err) => {
    console.log(err);
    console.log(req.body);
    if (err) return res.json(err);

    return res.json({
      message: "announcement succesfully created",
      data: announcement,
    });
  });
};

// Handle update actions
exports.update = function (req, res) {
  Announcement.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        content: req.body.content,
        updated_at: Date.now(),
      },
    }
  )
    .then((announcement) => {
      if (announcement) {
        return res.json({
          message: "announcement updated",
          data: announcement,
        });
      } else {
        return res.json({
          message: "announcements not found",
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
  Announcement.remove(
    {
      _id: req.params.id,
    },
    function (err, announcement) {
      if (err) return res.send(err);
      return res.json({
        status: "success",
        message: "Announcement Deleted!",
      });
    }
  );
};
