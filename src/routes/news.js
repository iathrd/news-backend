const route = require("express").Router();
const News = require("../controllers/news");

route.post("/createNews", News.createMessage);

module.exports = route;
