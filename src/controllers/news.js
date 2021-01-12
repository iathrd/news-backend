const { response } = require("../helpers/response");
const validation = require("../helpers/validations");
const { News } = require("../models");

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
      err.isJoi && response(res, err.message, {}, false, 400);
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
      const data = await validation.editNewsSchema.validateAsync(req.body);
      const find = await News.findOne({ where: { id } });
      if (find && find.userId === +userId) {
        const updateNews = await News.update(data, { where: { id } });
        if (updateNews) {
          response(res, "News updated", { data: { id, ...req.body, userId } });
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
      err.isJoi && response(res, err.message, {}, false, 400);
      console.log(err);
    }
  },
};
