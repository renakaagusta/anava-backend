const { authJwt } = require("../middlewares");
const controller = require("../controllers/answer-form.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/answer-form/:id", [authJwt.verifyToken], controller.view);
  app.get("/api/answer-form/:participantId/:stageId", [authJwt.verifyToken], controller.indexByParticipantAndStage);
  app.post("/api/answer-form", [authJwt.verifyToken], controller.create);
  app.delete("/api/answer-form/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);
};