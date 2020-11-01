const { authJwt } = require("../middlewares");
const controller = require("../controllers/answer.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/answer/question/:questionId", [authJwt.verifyToken, authJwt.isAdmin], controller.indexByQuestion);
  app.get("/api/answer/:id", [authJwt.verifyToken], controller.view);
  app.post("/api/answer/", [authJwt.verifyToken], controller.create);
  app.put("/api/answer/:id", [authJwt.verifyToken], controller.update);
};

