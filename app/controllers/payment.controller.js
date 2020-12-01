// Import Payment model
const db = require("../models");
var nodemailer = require("nodemailer");
const Payment = db.payment;
const Participant = db.user;
const Admin = db.user;
const Event = db.event;
const Mail = db.mail;

// Handle index actions
exports.index = async function (req, res) {
  await Payment.find({}, async function (err, payments) {
    if (err) return res.send(err);

    var index = 0;

    var payments = JSON.parse(JSON.stringify(payments));

    await Promise.all(
      payments.map(async (payment) => {
        await Participant.findById(
          payment.participant,
          async function (err, participant) {
            if (err) return res.status(400).send(err);

            payments[index].participant = participant;

            if (payments.length == index + 1) {
              console.log("1");
              index = 0;
              await Promise.all(
                payments.map(async (payment) => {
                  await Event.findById(
                    payment.event,
                    async function (err, event) {
                      if (err) return res.status(400).send(err);

                      payments[index].event = event;

                      if (payments.length == index + 1) {
                        console.log("2");
                        index = 0;
                        await Promise.all(
                          payments.map(async (payment) => {
                            await Admin.findById(
                              payment.verified_by,
                              async function (err, admin) {
                                if (err) return res.status(400).send(err);

                                payments[index].verified_by = admin;

                                if (payments.length == index + 1) {
                                  return res.json({
                                    status: "success",
                                    message: "Payment Added Successfully",
                                    data: payments,
                                  });
                                }
                                index++;
                              }
                            );
                          })
                        );
                      }
                      index++;
                    }
                  );
                })
              );
            }

            index++;
          }
        );
      })
    );
  }).catch(function (err) {
    console.log("Catch: ", err);
  });
};

// Handle index actions
exports.indexByParticipant = function (req, res) {
  Payment.find(
    {
      participant: req.params.participantId,
    },
    function (err, payments) {
      if (err) return res.send(err);

      return res.json({
        status: "success",
        message: "Payment Added Successfully",
        data: payments,
      });
    }
  );
};

// Handle create actions
exports.create = async function (req, res) {
  req.body.events.forEach(async function (event) {
    var payment = new Payment();
    payment.participant = req.body.participantId;
    payment.verified_by = req.body.adminId;
    payment.event = event._id;

    // Save and validate
    await payment.save(function (err) {
      if (err) return res.json(err);
    });
  });

  console.log(req.body.participantId);

  await Mail.findOne({}, async function (err, mail) {
    if (err) return res.status(500).send({ message: err });

    var email = mail.email;
    var password = email.password;

    await Participant.findById(
      req.body.participantId,
      async function (err, participant) {
        if (err) res.status(400).send(err);

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: mail.email,
            pass: mail.password,
          },
        });

        var mailOptions = {
          from: email,
          to: participant.email,
          subject: "Konfirmasi Pembayaran",
          html: req.body.mail,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) throw err;

          res.send({ message: "Payment was created successfully!" });
          return;
        });
      }
    );
  });
};

// Handle view actions
exports.view = function (req, res) {
  Payment.findById(req.params.id, function (err, payment) {
    if (err) return res.send(err);
    return res.json({
      message: "payments Detail Loading...",
      data: payment,
    });
  });
};

// Handle delete actions
exports.delete = function (req, res) {
  Payment.remove(
    {
      _id: req.params.id,
    },
    function (err, payment) {
      if (err) return res.send(err);

      return res.json({
        status: "success",
        message: "Payment Deleted!",
      });
    }
  );
};
