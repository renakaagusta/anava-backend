const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/auth/find-by-email/", controller.findByEmail);
  app.post("/api/auth/request-change-password/:email", controller.requestChangePassword);
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  app.post("/api/auth/signin", controller.signin);
  app.put("/api/auth/change-password/:id", controller.changePassword);
  app.put("/api/auth/confirm-email/:id", controller.confirmEmail);
  
};
