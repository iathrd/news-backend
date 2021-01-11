const route = require('express').Router()
const Auth = require('../controllers/auth')
const {upload} = require('../helpers/uploadFile')

route.post('/register',upload.single('avatar'),Auth.register)
route.post('/login',Auth.login)

module.exports= route