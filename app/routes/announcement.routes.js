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

  app.get("/api/announcement/all", [authJwt.verifyToken], controller.index);
  app.get("/api/announcement/:id", [authJwt.verifyToken], controller.view);
  app.post("/api/announcement/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
  app.put("/api/announcement/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.view);
  app.delete("/api/announcement/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.view);
};
