const { response } = require("../helpers/response");
const validation = require("../helpers/validations");
const { News } = require("../models");

module.exports = {
  createMessage: async (req, res) => {
    try {
    const {userId} = req.payload
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
};
