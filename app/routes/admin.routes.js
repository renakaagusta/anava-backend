const { authJwt } = require("../middlewares");
const controller = require("../controllers/admin.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/admin/all", [authJwt.verifyToken, authJwt.isAdmin], controller.index);
  app.get("/api/admin/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.view);
  app.put("/api/admin/verify", [authJwt.verifyToken, authJwt.isAdmin], controller.verify);
  app.put("/api/admin/upload", [authJwt.verifyToken, authJwt.isAdmin], controller.upload);
};
