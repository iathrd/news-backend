const route = require("express").Router();
const News = require("../controllers/news");
const { upload } = require("../helpers/uploadFile");

route.post("/createNews", upload.single("image"), News.createNews);
route.patch("/editNews/:id", upload.single("image"), News.editNews);
route.get("/new/:id", News.getNew);
route.get("/news", News.getNews);
route.get("/myNews", News.myNews);

module.exports = route;
