const route = require('express').Router()
const Category = require('../controllers/category')

route.post('/createCategory',Category.createCategory)


module.exports = route