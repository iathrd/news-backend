const route = require('express').Router()
const Auth = require('../controllers/auth')

route.post('/register',Auth.register)

module.exports= route