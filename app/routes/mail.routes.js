const { authJwt } = require("../middlewares");
const controller = require("../controllers/mail.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/mail/all", [authJwt.verifyToken, authJwt.isAdmin], controller.index);
  app.put("/api/mail", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
};
