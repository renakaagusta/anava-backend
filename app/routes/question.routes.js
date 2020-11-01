const { authJwt } = require("../middlewares");
const controller = require("../controllers/question.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/question/:id", [authJwt.verifyToken], controller.view);
  app.post("/api/question/", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
  app.put("/api/question/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.update);
  app.delete("/api/question/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);
};
