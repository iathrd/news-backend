const { response } = require("../helpers/response");
const validation = require("../helpers/validations");
const { News, User } = require("../models");
const { Op } = require("sequelize");
const { pagination } = require("../helpers/pagination");

module.exports = {
  createNews: async (req, res) => {
    try {
      const { userId } = req.payload;
      if (req.file !== undefined) {
        let { path } = req.file;
        path = path.replace(/\\/g, "/");
        req.body = {
          ...req.body,
          image: path,
        };
      }
      const newsContent = req.body.content
        .replace(/\./g, "")
        .replace(/\n/g, "")
        .split(" ")
        .join(" ");
      const readingTime = Math.ceil(newsContent.length / 250);
      const data = await validation.createNewsSchema.validateAsync(req.body);

      const sendData = await News.create({ ...data, readingTime, userId });
      if (sendData) {
        response(res, "News created", { data: sendData.dataValues });
      } else {
        response(res, "Internal server Error", {}, false, 500);
      }
    } catch (err) {
      err.isJoi
        ? response(res, err.message, {}, false, 400)
        : response(res, "Internal server error", {}, false, 500);
    }
  },
  editNews: async (req, res) => {
    try {
      const { userId } = req.payload;
      const { id } = req.params;
      if (req.file !== undefined) {
        let { path } = req.file;
        path = path.replace(/\\/g, "/");
        req.body = {
          ...req.body,
          image: path,
        };
      }
      if (req.file === undefined) {
        const newsContent = req.body.content
          .replace(/\./g, "")
          .replace(/\n/g, "")
          .split(" ")
          .join(" ");
        const readingTime = Math.ceil(newsContent.length / 250);
        req.body = {
          ...req.body,
          readingTime,
        };
      }

      const data = await validation.editNewsSchema.validateAsync(req.body);
      const find = await News.findOne({ where: { id } });
      if (find && find.userId === +userId) {
        const updateNews = await News.update(data, { where: { id } });
        console.log(updateNews);
        if (updateNews) {
          response(res, "News updated", {
            data: { ...find.dataValues, ...data },
          });
        } else {
          response(res, "Internal server error", {}, false, 500);
        }
      } else {
        if (!find) {
          response(res, `News with ${id} doesn't exist`);
        } else {
          response(res, "Authorization", {}, false, 401);
        }
      }
    } catch (err) {
      console.log(err);
      err.isJoi
        ? response(res, err.message, {}, false, 400)
        : response(res, "Internal server error", {}, false, 500);
    }
  },
  getNew: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.payload;
      const find = await News.findOne({
        include: [{ model: User, as: "creator" }],
        where: { id },
      });
      if (find && find.userId === userId) {
        response(res, "News detail", { data: find.dataValues });
      } else {
        !find
          ? response(res, `News with id ${id} doesn't exist`, {}, false, 400)
          : response(res, "Unautorization", {}, false, 401);
      }
    } catch (err) {
      response(res, "Internal server error", {}, false, 500);
    }
  },
  getNews: async (req, res) => {
    try {
      const {
        limit = 10,
        page = 1,
        search = "",
        sort = "createdAt",
        to = "ASC",
      } = req.query;
      const offset = (page - 1) * limit;
      const { count, rows } = await News.findAndCountAll({
        include: [{ model: User, as: "creator" }],
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              content: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        order: [[sort, to]],
        limit: +limit,
        offset: +offset,
      });
      if (rows) {
        const pageInfo = pagination(
          "/news/news",
          req.query,
          page,
          limit,
          count
        );
        response(res, "News list", { data: rows, pageInfo });
      } else {
        response(res, "Not found", []);
      }
    } catch (err) {
      response(res, "Internal server error", {}, false, 500);
    }
  },
  myNews: async (req, res) => {
    try {
      const { userId } = req.payload;
      const {
        limit = 10,
        page = 1,
        search = "",
        sort = "createdAt",
        to = "ASC",
      } = req.query;
      const offset = (page - 1) * limit;
      const { count, rows } = await News.findAndCountAll({
        include: [{ model: User, as: "creator" }],
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              content: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
          userId: userId,
        },
        order: [[sort, to]],
        limit: +limit,
        offset: +offset,
      });
      if (rows) {
        const pageInfo = pagination(
          "/news/myNews",
          req.query,
          page,
          limit,
          count
        );
        response(res, "My News list", { data: rows, pageInfo });
      } else {
        response(res, "Not found", []);
      }
    } catch (err) {
      response(res, "Internal server error", {}, false, 500);
    }
  },
};
