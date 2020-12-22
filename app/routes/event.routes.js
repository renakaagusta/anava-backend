const { authJwt } = require("../middlewares");
const controller = require("../controllers/event.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/event/all", [authJwt.verifyToken], controller.index);
  app.get("/api/event/:id", [authJwt.verifyToken], controller.view);
  app.put("/api/event/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
  app.put("/api/event/:id/upload", [authJwt.verifyToken], controller.upload);
  app.put("/api/event/:id/add", [authJwt.verifyToken], controller.add);

};
