const config = require("../config/auth.config");
var nodemailer = require("nodemailer");
const db = require("../models");
const User = db.user;
const Event = db.event;
const Role = db.role;
const Mail = db.mail;

var url = "http://anavaugm.com/";

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  console.log(JSON.stringify(req.body));
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  Mail.findOne({}, function (err, mail) {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    var email = mail.email;
    var password = email.password;

    //var email = "renakaagusta28@gmail.com"
    //var password = "@Renaka28"

    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      var mailBodyForVerification = "";
      mailBodyForVerification += "<!DOCTYPE html>";
      mailBodyForVerification += "<html>";
      mailBodyForVerification += "";
      mailBodyForVerification += "<head>";
      mailBodyForVerification += "    <title></title>";
      mailBodyForVerification +=
        '    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
      mailBodyForVerification +=
        '    <meta name="viewport" content="width=device-width, initial-scale=1">';
      mailBodyForVerification +=
        '    <meta http-equiv="X-UA-Compatible" content="IE=edge" />';
      mailBodyForVerification += '    <style type="text/css">';
      mailBodyForVerification += "        @media screen {";
      mailBodyForVerification += "            @font-face {";
      mailBodyForVerification += "                font-family: 'Lato';";
      mailBodyForVerification += "                font-style: normal;";
      mailBodyForVerification += "                font-weight: 400;";
      mailBodyForVerification +=
        "                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');";
      mailBodyForVerification += "            }";
      mailBodyForVerification += "";
      mailBodyForVerification += "            @font-face {";
      mailBodyForVerification += "                font-family: 'Lato';";
      mailBodyForVerification += "                font-style: normal;";
      mailBodyForVerification += "                font-weight: 700;";
      mailBodyForVerification +=
        "                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');";
      mailBodyForVerification += "            }";
      mailBodyForVerification += "";
      mailBodyForVerification += "            @font-face {";
      mailBodyForVerification += "                font-family: 'Lato';";
      mailBodyForVerification += "                font-style: italic;";
      mailBodyForVerification += "                font-weight: 400;";
      mailBodyForVerification +=
        "                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');";
      mailBodyForVerification += "            }";
      mailBodyForVerification += "";
      mailBodyForVerification += "            @font-face {";
      mailBodyForVerification += "                font-family: 'Lato';";
      mailBodyForVerification += "                font-style: italic;";
      mailBodyForVerification += "                font-weight: 700;";
      mailBodyForVerification +=
        "                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');";
      mailBodyForVerification += "            }";
      mailBodyForVerification += "        }";
      mailBodyForVerification += "";
      mailBodyForVerification += "        /* CLIENT-SPECIFIC STYLES */";
      mailBodyForVerification += "        body,";
      mailBodyForVerification += "        table,";
      mailBodyForVerification += "        td,";
      mailBodyForVerification += "        a {";
      mailBodyForVerification += "            -webkit-text-size-adjust: 100%;";
      mailBodyForVerification += "            -ms-text-size-adjust: 100%;";
      mailBodyForVerification += "        }";
      mailBodyForVerification += "";
      mailBodyForVerification += "        table,";
      mailBodyForVerification += "        td {";
      mailBodyForVerification += "            mso-table-lspace: 0pt;";
      mailBodyForVerification += "            mso-table-rspace: 0pt;";
      mailBodyForVerification += "        }";
      mailBodyForVerification += "";
      mailBodyForVerification += "        img {";
      mailBodyForVerification += "            -ms-interpolation-mode: bicubic;";
      mailBodyForVerification += "        }";
      mailBodyForVerification += "";
      mailBodyForVerification += "        /* RESET STYLES */";
      mailBodyForVerification += "        img {";
      mailBodyForVerification += "            border: 0;";
      mailBodyForVerification += "            height: auto;";
      mailBodyForVerification += "            line-height: 100%;";
      mailBodyForVerification += "            outline: none;";
      mailBodyForVerification += "            text-decoration: none;";
      mailBodyForVerification += "        }";
      mailBodyForVerification += "";
      mailBodyForVerification += "        table {";
      mailBodyForVerification +=
        "            border-collapse: collapse !important;";
      mailBodyForVerification += "        }";
      mailBodyForVerification += "";
      mailBodyForVerification += "        body {";
      mailBodyForVerification += "            height: 100% !important;";
      mailBodyForVerification += "            margin: 0 !important;";
      mailBodyForVerification += "            padding: 0 !important;";
      mailBodyForVerification += "            width: 100% !important;";
      mailBodyForVerification += "        }";
      mailBodyForVerification += "";
      mailBodyForVerification += "        /* iOS BLUE LINKS */";
      mailBodyForVerification += "        a[x-apple-data-detectors] {";
      mailBodyForVerification += "            color: inherit !important;";
      mailBodyForVerification +=
        "            text-decoration: none !important;";
      mailBodyForVerification += "            font-size: inherit !important;";
      mailBodyForVerification += "            font-family: inherit !important;";
      mailBodyForVerification += "            font-weight: inherit !important;";
      mailBodyForVerification += "            line-height: inherit !important;";
      mailBodyForVerification += "        }";
      mailBodyForVerification += "";
      mailBodyForVerification += "        /* MOBILE STYLES */";
      mailBodyForVerification +=
        "        @media screen and (max-width:600px) {";
      mailBodyForVerification += "            h1 {";
      mailBodyForVerification += "                font-size: 32px !important;";
      mailBodyForVerification +=
        "                line-height: 32px !important;";
      mailBodyForVerification += "            }";
      mailBodyForVerification += "        }";
      mailBodyForVerification += "";
      mailBodyForVerification += "        /* ANDROID CENTER FIX */";
      mailBodyForVerification += '        div[style*="margin: 16px 0;"] {';
      mailBodyForVerification += "            margin: 0 !important;";
      mailBodyForVerification += "        }";
      mailBodyForVerification += "    </style>";
      mailBodyForVerification += "</head>";
      mailBodyForVerification += "";
      mailBodyForVerification +=
        '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">';
      mailBodyForVerification += "    <!-- HIDDEN PREHEADER TEXT -->";
      mailBodyForVerification +=
        "    <div style=\"display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;\"> We're thrilled to have you here! Get ready to dive into your new account. </div>";
      mailBodyForVerification +=
        '    <table border="0" cellpadding="0" cellspacing="0" width="100%">';
      mailBodyForVerification += "        <!-- LOGO -->";
      mailBodyForVerification += "        <tr>";
      mailBodyForVerification +=
        '            <td bgcolor="#746cc0" align="center">';
      mailBodyForVerification +=
        '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">';
      mailBodyForVerification += "                    <tr>";
      mailBodyForVerification +=
        '                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>';
      mailBodyForVerification += "                    </tr>";
      mailBodyForVerification += "                </table>";
      mailBodyForVerification += "            </td>";
      mailBodyForVerification += "        </tr>";
      mailBodyForVerification += "        <tr>";
      mailBodyForVerification +=
        '            <td bgcolor="#746cc0" align="center" style="padding: 0px 10px 0px 10px;">';
      mailBodyForVerification +=
        '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">';
      mailBodyForVerification += "                    <tr>";
      mailBodyForVerification +=
        '                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">';
      mailBodyForVerification +=
        '                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Halo!</h1> <img src="http://anavaugm.com/logo-anava.png" width="125" height="120" style="display: block; border: 0px;" />';
      mailBodyForVerification += "                        </td>";
      mailBodyForVerification += "                    </tr>";
      mailBodyForVerification += "                </table>";
      mailBodyForVerification += "            </td>";
      mailBodyForVerification += "        </tr>";
      mailBodyForVerification += "        <tr>";
      mailBodyForVerification +=
        '            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">';
      mailBodyForVerification +=
        '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">';
      mailBodyForVerification += "                    <tr>";
      mailBodyForVerification +=
        '                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">';
      mailBodyForVerification +=
        '                            <p style="margin: 0;">Selamat datang di ANAVA 15 ' +
        req.body.username +
        ", sebelum mengikuti event-event ANAVA silahkan melakukan konfirmasi email akun anda dengan menekan tombol konfirmasi di bawah.</p>";
      mailBodyForVerification += "                        </td>";
      mailBodyForVerification += "                    </tr>";
      mailBodyForVerification += "                    <tr>";
      mailBodyForVerification +=
        '                        <td bgcolor="#ffffff" align="left">';
      mailBodyForVerification +=
        '                            <table width="100%" border="0" cellspacing="0" cellpadding="0">';
      mailBodyForVerification += "                                <tr>";
      mailBodyForVerification +=
        '                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">';
      mailBodyForVerification +=
        '                                        <table border="0" cellspacing="0" cellpadding="0">';
      mailBodyForVerification +=
        "                                            <tr>";
      mailBodyForVerification +=
        '                                                <td align="center" style="border-radius: 3px;" bgcolor="#58427c"><a href="' +
        url +
        "confirm-email/" +
        user._id +
        '" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; display: inline-block;">Konfirmasi</a></td>';
      mailBodyForVerification +=
        "                                            </tr>";
      mailBodyForVerification +=
        "                                        </table>";
      mailBodyForVerification += "                                    </td>";
      mailBodyForVerification += "                                </tr>";
      mailBodyForVerification += "                            </table>";
      mailBodyForVerification += "                        </td>";
      mailBodyForVerification += "                    </tr> <!-- COPY -->";
      mailBodyForVerification += "                    <tr>";
      mailBodyForVerification += "                        ";
      mailBodyForVerification += "            </td>";
      mailBodyForVerification += "        </tr>";
      mailBodyForVerification += "    </table>";
      mailBodyForVerification += "</body>";
      mailBodyForVerification += "";
      mailBodyForVerification += "</html>";

      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            user.roles = roles.map((role) => role._id);
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              var transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: email,
                  pass: password,
                },
              });

              var mailOptions = {
                from: email,
                to: req.body.email,
                subject: "Konfirmasi Email ANAVA",
                html: mailBodyForVerification,
              };

              transporter.sendMail(mailOptions, (err, info) => {
                console.log(err);
                if (err) return res.status(500).json(err);

                res.send({ message: "User was registered successfully!" });
                return;
              });
            });
          }
        );
      } else {
        Role.find({}, (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = [];

          roles.forEach((role) => {
            if (role.name != "admin") user.roles.push(role._id);
          });

          user.participant.location = {
            province: req.body.province ? req.body.province : "Jawa Tengah",
            city: req.body.city ? req.body.city : "Pati",
            subdistrict: req.body.subdistrict ? req.body.subdistrict : "Pati",
          };

          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: mail.email,
                pass: mail.password,
              },
            });

            var mailOptions = {
              from: mail.email,
              to: req.body.email,
              subject: "Konfirmasi Email ANAVA",
              html: mailBodyForVerification,
            };

            transporter.sendMail(mailOptions, (err, info) => {
              console.log(err);
              console.log(info);
              if (err) return res.status(500).send(err);

              return res.send({
                message: "User was registered successfully!",
              });
            });
          });
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  var filter = {};
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      req.body.username
    )
  )
    filter = {
      email: req.body.username,
    };
  else
    filter = {
      username: req.body.username,
    };

  User.findOne(filter)
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Pengguna tidak ditemukan" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Pengguna tidak ditemukan",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400,
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name);
      }

      var event = [];

      user.participant.events.forEach((event_id) => {
        Event.findById(event_id, function (err, _event) {
          if (err) return res.status(400).send(err);

          event.push(_event);
        });
      });

      user.participant.event = event;

      res.status(200).send({
        id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        image: user.image,
        verification: user.verification,
        email: user.email,
        roles: authorities,
        participant: user.participant,
        accessToken: token,
      });
    });
};

exports.findByEmail = (req, res) => {
  User.findOne(
    {
      email: req.body.email,
    },
    (err, user) => {
      if (err) throw err;

      return res.json({
        status: "success",
        message: "User detail loading..",
        data: user,
      });
    }
  );
};

exports.confirmEmail = (req, res) => {
  console.log(req.params.id);
  User.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: {
        verification: 1,
      },
    },
    { new: true },
    (err, user) => {
      if (err) return res.status(500).send(err);

      console.log(user);

      return res.json({
        status: "success",
        message: "Email berhasil dikonfirmasi",
        data: user,
      });
    }
  );
};

exports.requestChangePassword = (req, res) => {
  Mail.findOne({}, function (err, mail) {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    User.findOne(
      {
        email: req.params.email,
      },
      function (err, user) {
        if (err) res.status(500).send(err);

        console.log(req.params);

        if (user) {
          var mailBodyForChangePassword =
            "<!DOCTYPE html>" +
            "<html>" +
            "" +
            "<head>" +
            "    <title></title>" +
            '    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
            '    <meta name="viewport" content="width=device-width, initial-scale=1">' +
            '    <meta http-equiv="X-UA-Compatible" content="IE=edge" />' +
            '    <style type="text/css">' +
            "        @media screen {" +
            "            @font-face {" +
            "                font-family: 'Lato';" +
            "                font-style: normal;" +
            "                font-weight: 400;" +
            "                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');" +
            "            }" +
            "" +
            "            @font-face {" +
            "                font-family: 'Lato';" +
            "                font-style: normal;" +
            "                font-weight: 700;" +
            "                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');" +
            "            }" +
            "" +
            "            @font-face {" +
            "                font-family: 'Lato';" +
            "                font-style: italic;" +
            "                font-weight: 400;" +
            "                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');" +
            "            }" +
            "" +
            "            @font-face {" +
            "                font-family: 'Lato';" +
            "                font-style: italic;" +
            "                font-weight: 700;" +
            "                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');" +
            "            }" +
            "        }" +
            "" +
            "        /* CLIENT-SPECIFIC STYLES */" +
            "        body," +
            "        table," +
            "        td," +
            "        a {" +
            "            -webkit-text-size-adjust: 100%;" +
            "            -ms-text-size-adjust: 100%;" +
            "        }" +
            "" +
            "        table," +
            "        td {" +
            "            mso-table-lspace: 0pt;" +
            "            mso-table-rspace: 0pt;" +
            "        }" +
            "" +
            "        img {" +
            "            -ms-interpolation-mode: bicubic;" +
            "        }" +
            "" +
            "        /* RESET STYLES */" +
            "        img {" +
            "            border: 0;" +
            "            height: auto;" +
            "            line-height: 100%;" +
            "            outline: none;" +
            "            text-decoration: none;" +
            "        }" +
            "" +
            "        table {" +
            "            border-collapse: collapse !important;" +
            "        }" +
            "" +
            "        body {" +
            "            height: 100% !important;" +
            "            margin: 0 !important;" +
            "            padding: 0 !important;" +
            "            width: 100% !important;" +
            "        }" +
            "" +
            "        /* iOS BLUE LINKS */" +
            "        a[x-apple-data-detectors] {" +
            "            color: inherit !important;" +
            "            text-decoration: none !important;" +
            "            font-size: inherit !important;" +
            "            font-family: inherit !important;" +
            "            font-weight: inherit !important;" +
            "            line-height: inherit !important;" +
            "        }" +
            "" +
            "        /* MOBILE STYLES */" +
            "        @media screen and (max-width:600px) {" +
            "            h1 {" +
            "                font-size: 32px !important;" +
            "                line-height: 32px !important;" +
            "            }" +
            "        }" +
            "" +
            "        /* ANDROID CENTER FIX */" +
            '        div[style*="margin: 16px 0;"] {' +
            "            margin: 0 !important;" +
            "        }" +
            "    </style>" +
            "</head>" +
            "" +
            '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">' +
            "    <!-- HIDDEN PREHEADER TEXT -->" +
            "    <div style=\"display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;\"> We're thrilled to have you here! Get ready to dive into your new account. </div>" +
            '    <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
            "        <!-- LOGO -->" +
            "        <tr>" +
            '            <td bgcolor="#746cc0" align="center">' +
            '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">' +
            "                    <tr>" +
            '                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>' +
            "                    </tr>" +
            "                </table>" +
            "            </td>" +
            "        </tr>" +
            "        <tr>" +
            '            <td bgcolor="#746cc0" align="center" style="padding: 0px 10px 0px 10px;">' +
            '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">' +
            "                    <tr>" +
            '                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">' +
            '                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Ganti sandi</h1> <img src="http://anavaugm.com/logo-anava.png" width="125" height="120" style="display: block; border: 0px;" />' +
            "                        </td>" +
            "                    </tr>" +
            "                </table>" +
            "            </td>" +
            "        </tr>" +
            "        <tr>" +
            '            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">' +
            '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">' +
            "                    <tr>" +
            '                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">' +
            '                            <p style="margin: 0;">Untuk mengganti sandi dari akun anda silahkan menekan tombol berikut.</p>' +
            "                        </td>" +
            "                    </tr>" +
            "                    <tr>" +
            '                        <td bgcolor="#ffffff" align="left">' +
            '                            <table width="100%" border="0" cellspacing="0" cellpadding="0">' +
            "                                <tr>" +
            '                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">' +
            '                                        <table border="0" cellspacing="0" cellpadding="0">' +
            "                                            <tr>" +
            '                                                <td align="center" style="border-radius: 3px;" bgcolor="#746cc0"><a href="http://anavaugm.com/change-password/' +
            user._id +
            '" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; display: inline-block;">Ganti</a></td>' +
            "                                            </tr>" +
            "                                        </table>" +
            "                                    </td>" +
            "                                </tr>" +
            "                            </table>" +
            "                        </td>" +
            "                    </tr> <!-- COPY -->" +
            "                    <tr>" +
            "                        " +
            "            </td>" +
            "        </tr>" +
            "    </table>" +
            "</body>" +
            "" +
            "</html>";

          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: mail.email,
              pass: mail.password,
            },
          });

          var mailOptions = {
            from: mail.email,
            to: req.params.email,
            subject: "Ganti sandi akun ANAVA",
            html: mailBodyForChangePassword,
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err;

            return res.send({
              message: "Permintaan ganti sandi berhasil dikirim ke email",
            });
          });
        } else {
          return res.send({
            message: "Pengguna tidak ditemukan",
          });
        }
      }
    );
  });
};

exports.changePassword = (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: {
        password: bcrypt.hashSync(req.body.password, 8),
      },
    },
    (err, user) => {
      if (err) return res.status(500).send(err);

      console.log(user);

      return res.json({
        status: "success",
        message: "Password change successfully",
        data: user,
      });
    }
  );
};
