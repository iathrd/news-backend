const { response } = require("../helpers/response");
const validation = require("../helpers/validations");
const { Category } = require("../models");

module.exports = {
  createCategory: async (req, res) => {
    try {
      const { userId } = req.payload;
      const data = await validation.createCategorySchema.validateAsync(
        req.body
      );
      const send = await Category.create({ ...data, userId });
      if (send) {
        response(res, "Category created", { data: send.dataValues });
      } else {
        response(res, "Internal server error", {}, false, 500);
      }
    } catch (err) {
        console.log(err)
      err.isJoi
        ? response(res, err.message, {}, false, 400)
        : response(res, "Internal server error", {}, false);
    }
  },
};
