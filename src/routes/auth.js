const route = require("express").Router();
const Auth = require("../controllers/auth");
const { upload } = require("../helpers/uploadFile");
const { verifyAccessToken } = require("../helpers/jwt");

route.post("/register", upload.single("avatar"), Auth.register);
route.post("/login", Auth.login);
route.get("/getUser", verifyAccessToken, Auth.getUser);
route.post(
  "/updateUser",
  verifyAccessToken,
  upload.single("avatar"),
  Auth.editUser
);
route.post("/changePassword", Auth.changePassword);

module.exports = route;
