const { authJwt } = require("../middlewares");
const controller = require("../controllers/announcement.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/announcement/all", [authJwt.verifyToken, authJwt.isAdmin], controller.index);
  app.get("/api/announcement/all/general", [authJwt.verifyToken], controller.indexGeneral);
  app.get("/api/announcement/stage/:id", [authJwt.verifyToken], controller.indexByStage);
  app.get("/api/announcement/participant/:id", [authJwt.verifyToken], controller.indexByParticipant);
  app.get("/api/announcement/:id", [authJwt.verifyToken], controller.view);
  app.post("/api/announcement/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
  app.put("/api/announcement/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.view);
  app.delete("/api/announcement/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.view);
};
