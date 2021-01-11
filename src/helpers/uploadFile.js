const multer = require('multer')
const fs = require('fs')
const path = require('path')

const size = 2 * 1024 * 1024
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './assets/uploads/img'

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: size },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('The uploaded file must jpg|jpeg|png'), false)
    }
    cb(null, true)
  }

})

module.exports = {
  upload
}