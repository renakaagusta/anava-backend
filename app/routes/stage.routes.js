const { authJwt } = require("../middlewares");
const controller = require("../controllers/stage.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/stage/all", [authJwt.verifyToken], controller.index);
  app.get("/api/stage/:id", [authJwt.verifyToken], controller.view);
  app.put("/api/stage/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
  app.put("/api/stage/:id/add", [authJwt.verifyToken, authJwt.isAdmin], controller.add);
};
