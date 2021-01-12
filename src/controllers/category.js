const { response } = require("../helpers/response");
const validation = require("../helpers/validations");
const { Category } = require("../models");
const { Op } = require("sequelize");
const { pagination } = require("../helpers/pagination");

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
      console.log(err);
      err.isJoi
        ? response(res, err.message, {}, false, 400)
        : response(res, "Internal server error", {}, false);
    }
  },
  editCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const find = await Category.findOne({ where: { id } });
      const data = await validation.editCategorySchema.validateAsync(req.body);
      if (find) {
        const editData = await Category.update(data, { where: { id } });
        if (editData) {
          response(res, "Edit Category succesfuly", {
            data: { ...find.dataValues, ...req.body },
          });
        } else {
          response(res, "Internal server error", {}, false, 500);
        }
      } else {
        response(res, `Category with id ${id} doesn't exist`, {}, false, 400);
      }
    } catch (err) {
      err.isJoi
        ? response(res, err.message, {}, false, 400)
        : response(res, "Internal server error", {}, false, 500);
    }
  },
  listCategory: async (req, res) => {
    const {
      limit = 10,
      page = 1,
      search = "",
      sort = "name",
      to = "ASC",
    } = req.query;
    const offset = (page - 1) * limit;
    try {
      const { count, rows } = await Category.findAndCountAll({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        order: [[sort, to]],
        limit: +limit,
        offset: +offset,
      });
      if (rows) {
        const pageInfo = pagination(
          "/category/listCategory",
          req.query,
          page,
          limit,
          count
        );
        response(res, "List Category", { data: rows, pageInfo });
      } else {
        response(res, "Data not found", { data: [] });
      }
    } catch (err) {
      response(res, "Internal server error", {}, false, 500);
    }
  },
};
