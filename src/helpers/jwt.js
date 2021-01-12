const jwt = require("jsonwebtoken");
const { response } = require("./response");

module.exports = {
  signAccesToken: (userid) => {
    return new Promise((resolve, reject) => {
      const payload = {
        userId: userid,
      };
      const secret = process.env.APP_KEY;
      const options = {
        // issuer: 'iqbal.com',
        // audience: userid.toString()
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers.authorization) {
      return response(res, "Unautorized", {}, false, 401);
    }
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    jwt.verify(token, process.env.APP_KEY, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return response(res, message, {}, false, 401);
      }
      req.payload = payload;
      next();
    });
  },
};
