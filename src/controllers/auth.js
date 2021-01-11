const { response } = require("../helpers/response");
const validation = require("../helpers/validations");
const { User } = require("../models");
const argon = require("argon2");
const { where } = require("sequelize");

module.exports = {
  register: async (req, res) => {
    try {
      if (req.file !== undefined) {
        let { path } = req.file;
        path = path.replace(/\\/g, "/");
        req.body = {
          ...req.body,
          avatar: path,
        };
      }
      const data = await validation.registerSchema.validateAsync(req.body);
      const hashedPassword = await argon.hash(data.password);
      const find = await User.findOne({ where: { email: data.email } });
      if (!find) {
        const sendData = await User.create({
          ...data,
          password: hashedPassword,
        });
        if (sendData) {
          response(res, "Register succesfully!", {
            data: { ...sendData.dataValues, password: undefined },
          });
        } else {
          response(res, "Internal Server Error", {}, false, 500);
        }
      } else {
        response(res, "Email alreade taken!", {}, false, 400);
      }
    } catch (err) {
      err.isJoi && response(res, err.message, {}, false, 400);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (user) {
        const verifyPassword = await argon.verify(user.password, password);
        if (verifyPassword) {
          response(res, "Login succesfuly");
        } else {
          response(res, "Invalid email or password", {}, false, 400);
        }
      } else {
        response(res, "Invalid email or passaword", {}, false, 400);
      }
    } catch (err) {}
  },
};
