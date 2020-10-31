const { authJwt } = require("../middlewares");
const controller = require("../controllers/participant.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/participant/all", [authJwt.verifyToken, authJwt.isAdmin], controller.index);
  app.get("/api/participant/:id", [authJwt.verifyToken], controller.view);
  app.put("/api/participant/:id/verify", [authJwt.verifyToken, authJwt.isAdmin], controller.verify);
  app.put("/api/participant/:id/upload", [authJwt.verifyToken, authJwt.isParticipant], controller.upload);
};
