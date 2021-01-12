const route = require('express').Router()
const Category = require('../controllers/category')

route.post('/createCategory',Category.createCategory)
route.patch('/editCategory/:id',Category.editCategory)


module.exports = route