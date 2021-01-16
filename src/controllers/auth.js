const { response } = require("../helpers/response");
const validation = require("../helpers/validations");
const { User } = require("../models");
const argon = require("argon2");
const { signAccesToken } = require("../helpers/jwt");

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
      err.isJoi
        ? response(res, err.message, {}, false, 400)
        : response(res, "Internal server error", {}, false, 500);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (user) {
        const verifyPassword = await argon.verify(user.password, password);
        if (verifyPassword) {
          const token = await signAccesToken(user.id);
          response(res, "Login succesfuly", { token });
        } else {
          response(res, "Invalid email or password", {}, false, 400);
        }
      } else {
        response(res, "Invalid email or passaword", {}, false, 400);
      }
    } catch (err) {
      response(res, "Internal server error", {}, false, 500);
    }
  },
  getUser: async (req, res) => {
    try {
      const { userId } = req.payload;
      const find = await User.findOne({ where: { id: userId } });
      console.log(find);
      if (find) {
        response(res, "user", {
          data: { ...find.dataValues, password: undefined },
        });
      } else {
        response(res, "Internal server error", {}, false, 500);
      }
    } catch (error) {
      response(res, "Internal server error", {}, false, 400);
    }
  },
  editUser: async (req, res) => {
    try {
      const { email } = req.body;
      const { userId } = req.payload;
      if (req.file !== undefined) {
        let { path } = req.file;
        path = path.replace(/\\/g, "/");
        req.body = {
          ...req.body,
          avatar: path,
        };
      }
      if (email !== undefined) {
        const find = await User.findOne({ where: { email: email } });
        if (find) {
          response(res, `Email ${req.body.email} already taken`);
        } else {
          const updateData = await User.update(req.body, {
            where: { id: userId },
          });
          if (updateData) {
            response(res, "Profile succesfuly updated");
          } else {
            response(res, "Intermal server error", {}, false, 500);
          }
        }
      } else {
        const updateData = await User.update(req.body, {
          where: { id: userId },
        });
        if (updateData) {
          if (updateData) {
            response(res, "Profile succesfuly updated");
          } else {
            response(res, "Intermal server error", {}, false, 500);
          }
        }
      }
    } catch (error) {
      response(res, "Internal server error", {}, false, 500);
    }
  },
};
