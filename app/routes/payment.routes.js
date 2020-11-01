const { authJwt } = require("../middlewares");
const controller = require("../controllers/payment.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/payment/all", [authJwt.verifyToken, authJwt.isAdmin], controller.index);
  app.get("/api/payment/participant/:participantId", [authJwt.verifyToken], controller.indexByParticipant);
  app.get("/api/payment/:id", [authJwt.verifyToken], controller.view);
  app.post("/api/payment", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
  app.delete("/api/payment/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);
};

