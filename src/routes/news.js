const route = require("express").Router();
const News = require("../controllers/news");
const { upload } = require("../helpers/uploadFile");

route.post("/createNews",upload.single('image'), News.createMessage);

module.exports = route;
