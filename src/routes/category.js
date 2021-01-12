const route = require("express").Router();
const category = require("../controllers/category");
const Category = require("../controllers/category");

route.post("/createCategory", Category.createCategory);
route.patch("/editCategory/:id", Category.editCategory);
route.get("/listCategory", category.listCategory);

module.exports = route;
